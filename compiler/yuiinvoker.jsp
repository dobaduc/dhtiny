<%@ page import="java.io.*, java.lang.*" %>
<%
/*
for (Enumeration e = request.getParameterNames(); e.hasMoreElements() ;) {
    String param= e.nextElement().toString();
    out.print(param +"<br>");
}*/

String path = request.getRealPath("/");
String concatFile  = "cat ";
String compress = "java -jar " + path +"/yuicommpressor-2.4.7.jar --type js "+
                        path +"/tmp/input.js"+
                        " -o " + path + "/tmp/output.js";

// Combine file list
String[] files;
try {
    files = request.getParameterValues("modules");
    if (files == null) {
        throw new Exception();
    }
} catch (Exception e) {
    // Stop script
    return;
}
for (int i = 0; i < files.length; i++) {
    concatFile += files[i];
}
concatFile += " > "+ path+ "/tmp/input.js";

try  {
    Runtime.getRuntime().exec(concatFile);
    Thread.sleep(2000);
    Runtime.getRuntime().exec(compress);
    Thread.sleep(10000);
}  
catch(Exception e)  
{  
}
%>
<%
BufferedReader reader = new BufferedReader(new FileReader(path+"/tmp/output.js"));
StringBuilder builder = new StringBuilder();
String line;    

// For every line in the file, append it to the string builder
while((line = reader.readLine()) != null)
{
    builder.append(line);
}

String xoutput = builder.toString();
%>
<%= xoutput %>