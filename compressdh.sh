#!/bin/bash

# Clean target if necessary
echo "$1"
if [ "$1" == "fresh" ]
then
  mkdir -p ./compiled/{ctrl,util}
  rm -rf ./dhtinycompact/*
fi

# Get file list
FILES=`find . -type f -name '*.js'`
ignorePath="docgen/"

# Loop
for f in $FILES
do
  if `echo ${f} | grep "${ignorePath}" 1>/dev/null 2>&1`
  then
    echo "[Ignored] Doc file: $f"
  else
    if [ -f "../dhtinycompact/$f" ] && [ "$1" == "recreate"];
    then
      echo "[Ignored] Target file ../dhtinycompact/$f is existing!"
    else
      echo "Processing file: $f ..." &&
      java -jar compiler.jar --js=$f --js_output_file=$f.tmp &&
      mv $f.tmp ../dhtinycompact/$f

      #rm $f &&
      #java -jar yuicompressor-2.4.7.jar --type js $f.tmp -o ../dhtinycompact/$f &&
      #rm $f.tmp

    fi
  fi
done
