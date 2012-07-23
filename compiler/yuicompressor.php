<?php

// Source: https://github.com/gpbmike/PHP-YUI-Compressor.git
// 
// Doba's memo:
// - Known JVM problem on MAMP for MacOSX:
//    Error occurred during initialization of VM
//    Unable to load native library: libjava.jnilib
// - Solution: http://stackoverflow.com/questions/7650013/java-1-6-broken-when-called-by-background-symfony-task
//    Edit /Applications/MAMP/Library/bin/envvars, comment out these lines then restart MAMP
//      #DYLD_LIBRARY_PATH="/Applications/MAMP/Library/lib:$DYLD_LIBRARY_PATH"
//      #export DYLD_LIBRARY_PATH

class YUICompressor {

    // absolute path to YUI jar file.
    private static $JAR_PATH;
    private static $TEMP_FILES_DIR;
    private $options = array('type' => 'js',
        'linebreak' => false,
        'verbose' => false,
        'nomunge' => false,
        'semi' => false,
        'nooptimize' => false);
    private $files = array();
    private $string = '';

    // construct with a path to the YUI jar and a path to a place to put temporary files
    function __construct($JAR_PATH, $TEMP_FILES_DIR, $options = array()) {
        $this->JAR_PATH = $JAR_PATH;
        $this->TEMP_FILES_DIR = $TEMP_FILES_DIR;

        foreach ($options as $option => $value) {
            $this->setOption($option, $value);
        }
    }

    // set one of the YUI compressor options
    function setOption($option, $value) {
        $this->options[$option] = $value;
    }

    // add a file (absolute path) to be compressed
    function addFile($file) {
        array_push($this->files, $file);
    }

    // add a strong to be compressed
    function addString($string) {
        $this->string .= ' ' . $string;
    }

    // the meat and potatoes, executes the compression command in shell
    function compress() {

        // read the input
        foreach ($this->files as $file) {
            $this->string .= file_get_contents($file) or die("Cannot read from uploaded file");
        }

        // create single file from all input
        $input_hash = sha1($this->string);
        $file = $this->TEMP_FILES_DIR . '/' . $input_hash . '.txt';
        $fh = fopen($file, 'w') or die("Can't create new file");
        fwrite($fh, $this->string);
        fclose($fh);

        // start with basic command
        $cmd = "java -Xmx32m -jar " . escapeshellarg($this->JAR_PATH) . ' ' . escapeshellarg($file) . " --charset UTF-8";

        // set the file type
        $cmd .= " --type " . (strtolower($this->options['type']) == "css" ? "css" : "js");

        // and add options as needed
        if ($this->options['linebreak'] && intval($this->options['linebreak']) > 0) {
            $cmd .= ' --line-break ' . intval($this->options['linebreak']);
        }

        if ($this->options['verbose']) {
            $cmd .= " -v";
        }

        if ($this->options['nomunge']) {
            $cmd .= ' --nomunge';
        }

        if ($this->options['semi']) {
            $cmd .= ' --preserve-semi';
        }

        if ($this->options['nooptimize']) {
            $cmd .= ' --disable-optimizations';
        }

        // execute the command
        exec($cmd . ' 2>&1', $raw_output);

        // add line breaks to show errors in an intelligible manner
        $flattened_output = implode("\n", $raw_output);

        // clean up (remove temp file)
        unlink($file);

        // return compressed output
        return $flattened_output;
    }

}

?>
