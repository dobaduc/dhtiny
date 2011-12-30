/*

Title: DHTiny developer's guide

*Author*:   Do Ba Duc

*Cooperators*: Do Phan, Nguyen Duc Hung
 
Preface:
In this guide, I will show you how to write source code in DHTiny-style step by step.
In my opinion, examples can tell more than words, so I'll try to present here many easy to understand examples to help you start working with DHTiny quickly.
Please take a look back to the API document any time you want to know more details about DHTiny's core module and built-in classes.

Section: 1. DHTiny's folder structure

Firstly, you need to download DHTiny's latest version from here: https://www.assembla.com/spaces/dhtiny/milestones/386828-release-1-1-4

After exacting DHTiny to a local folder, you will see following folders

  ctrl/. - Contains DHTiny's built-in controls
  demos/. - Contains all live demos
  res/. - Contains some resources (images, style sheets)
  util/. - Contains utility classes
  dhtiny.js - DHTiny core module

I highly recommend that you put your first source code under *demos* folder.
By copy & paste an existing demo to another folder name under *demos* folder, your preparation time can be greatly reduced.
Before moving to the next step, let's create a folder *dhtiny/demos/example*, where we will put all example source code to from now on. 

Section: 2. Core module

2.1. Core module's function:

DHTiny's core module defines namespace, possesses basic components like cross-browser processing,
supports object-oriented programming and also has some other utilities.
By including DHTiny's core module into HTML page through a <script> tag,
you can use basic functions above freely. Besides you can add any other DHTiny's modules whenever the program need.
For example, you can start using DHTiny library using this demo
 
(start code)
<!-- dhtiny/demos/example/index.html -->
<html>
  <head>
    <title>DHTiny example</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="../../dhtiny.js"></script>
    <script type="text/javascript">
        // This function will be called after HTML document is loaded
        $dh.addLoader(function() {
            alert("Hello world! You're using " + $dh.browser.name);
        });
    </script>
  </head>
  <body>
  </body>
</html>
(end) 

Above source code will show the greeting message and current browser name after HTML document is loaded ( See <addLoader>, <browser> for more details).
Now let's see how to get work with existing elements in the document

(start code)
<!-- dhtiny/demos/example/index.html -->
<html>
  <head>
    <title>DHTiny example</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="../../dhtiny.js"></script>
    <script type="text/javascript">
        // This function will be called after HTML document is loaded
        $dh.addLoader(function() {
            $dh.el("testDIV").innerHTML += ", my content has been changed!";
            $dh.css("testDIV", ";border: solid 2px blue;color:red;background:yellow;");
        });
    </script>
  </head>
  <body>
  	<div id ="testDIV">Hello</div>
  </body>
</html>
(end)

Now let's play a bit more with style-related functions (See <css>, <pos>, <size>, <bounds> for more details)

(start code)
<!-- dhtiny/demos/example/index.html -->
<html>
  <head>
    <title>DHTiny example</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="../../dhtiny.js"></script>
    <script type="text/javascript">
        // This function will be called after HTML document is loaded
        $dh.addLoader(function() {
        	var div = $dh.el("testDIV");
            $dh.css(div, ";position:absolute;border: solid 2px blue;color:red;background:yellow;");

            alert("Moving to left=100, top=100 ...");
            $dh.css(div, {top: 100, left: 100});
            alert("Moving to left=100, top=200 ...");
            $dh.pos(div, [100, 200]);
            alert("Moving to left=200, top=200 ...");
            $dh.pos(div, 200, 200);

            alert("Resizing to width=100, height=100 ...");
            $dh.size(div,100,100);

            b = $dh.bounds(div);
            alert("Calculated boundaries: left="+b.left+ ", top="+b.top+", width="+b.width+", height="+b.height);
            alert("Reseting boundaries to left=10, top=10, width= 200, height =300 ....");
            $dh.bounds(div, 10, 10, 200, 300);
        });
    </script>
  </head>
  <body>
  	<div id ="testDIV">Hello</div>
  </body>
</html>
(end)

This demo let you see, by including library's core module through $dh namespace, you can use DHTiny's utility functions
like: demanding to process right after the browser was loaded, searching a object inside page, changing colors, position, size of a object, 
 calculating object's attributes etc. Besides, by using core module, you can work freely with AJAX and OOP ( object-oriented programming),
 details will be described in the next part.

Besides, DHTiny provides an useful functionality called "shortcut". It helps to write the code even shorter.
Let's see how to do the same thing with above example using shortcuts:

(start code)
<!-- dhtiny/demos/example/index.html -->
<html>
  <head>
    <title>DHTiny example</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="../../dhtiny.js"></script>
    <script type="text/javascript">
        // This function will be called after HTML document is loaded
        $dh.addLoader(function() {
            var div = $dh.el("testDIV");
            $dh.css(div, ";position:absolute;border: solid 2px blue;color:red;background:yellow;");

            alert("Moving to left=200, top=200 ...");
            $dh.set(div, { pos: [200,200] });

            alert("Resizing to width=100, height=100 ...");
            $dh.set(div, { size: [100,100]});

            b = $dh.bounds(div);
            alert("Calculated boundaries: left="+b.left+ ", top="+b.top+", width="+b.width+", height="+b.height);
            alert("Reseting boundaries to left=10, top=10, width= 200, height =300 ....");
            $dh.set(div, {
                bounds: [10, 10, 200, 300],
                innerHTML: "Wow, we've made it!",
                background: "lightgreen"
            });
        });
    </script>
  </head>
  <body>
  	<div id ="testDIV">Hello</div>
  </body>
</html>
(end)

In the example above, you can see many *$dh.set* function calls. That is a very important function which helps to shorten DHTiny-style source code.
What it does is just set all properties of the given object to a target object. You just have to specify as many properties as you want within a bracket,
pass it as a single parameter to *$dh.set* function, that DHTiny will do all the rest for you.

2.2. Syntax/usage of DHTiny's functions:

DHTiny's basic functions can be used through *$dh* or *$dhtiny* namespace.
 Packing all library's functions into one namespace helps decreasing malfunctions with other libraries.
 You know, famous libraries often using char $ as a short namespace for the beginning of using utility functions.
 I personally used to use this character, however after realized problems when I put dhtiny along with other libraries using the same char $,
 I decided to chose a spectacular name in order to avoid overlaps.   

Naming functions/properties shorter makes source code tidier. However, in actually it causes difficulties for beginners. Thus, DHTiny's functions are not only named as short as possible but also easy to remember. 
For example: <$dh.pos> is position-processing function,  <$dh.bounds> is boundary processing function, <$dh.set> is used for setting a set of property/value pairs to object.

All of DHtiny's functions are also diversified access-allowed functions, return results which are depended on passed parameters.
 For example, with $dh.pos, we have some methods to use:

 - Return the position of object as a hash { left: left_value,top: top_value}: *$dh.pos(obj)*
 - Assign new position values to object obj: *$dh.pos(obj,left,top)* or *$dh.pos(obj,[left,top])* or through "shortcuts” so-called methods which will be introduced in the next part of this document.

DHtiny has once supported using functions like below

(start code)
$dhtiny.el("#div").css("border:solid 1px red;").bounds(10,20,30,40).opacity(20).hide() 
(end)

I have temporary hided this method since I changed library's namespace.
 However following some small changes I will reconstructed it in the near future in order to serving to whom use to writing complex codes in the same line.

2.3. How to include external modules at runtime:

As I mentioned on above, DHTiny allows you to add any module in any part which you want in runtime. The function allows you to do that is $dh.Require.
When you  want to use a javascript module, normally you would have to write many javascript tags like this
(start code)
<script type="text/javascript" src="file1.js"></script>
<script type="text/javascript" src="file2.js"></script>
<script type="text/javascript" src="file3.js"></script>
(end)

Not only list modules like above but also you have to manage the order of list. For example, if file2.js refers a function in file1.js, file1.js should be declared before file2.js. You must obey the order of file1.js and file2.js or some errors will occur. Moreover, inside program, file3.js is used only in one case , and in other cases, it is never used, but you still have to declare to use it. If not, some errors will occur.
With DHTiny, you can replace all of declaring lines above just by using *$dh.Require*, and you can ignore those complicated listing modules by tag <script> on above.

For example: DHDialog module is a module which is constructed by many foundations, modules like: <DHEvent>, <DHDragManager>, <DHAnimation>, <DHRichCanvas>, <DHAnimItem>. Normally, in order to use this module, you need to declare
(start code)
<script type="text/javascript" src="dtiny.js"></script
<script type="text/javascript" src="util/event.js"></script>
<script type="text/javascript" src="util/dragmanager.js"></script>
<script type="text/javascript" src="ctrl/richcanvas.js"></script>
<script type="text/javascript" src="ctrl/animitem.js"></script>
<script type="text/javascript" src="ctrl/dialog.js"></script>
(end)
   
However, you can simplify it by using this
(start code)
<script type="text/javascript" src="dtiny.js"></script>  <!— core module, must have --!>
<script type="text/javascript">    <!— your main program --!> 
  ..........
  // In somewhere inside your program
  if ( needToShowDialog ) {         // Only when you need module, you declare it
    $dh.Require("ctrl/dialog");   // All of modules which are needed for DHDialog are loaded just by only one line.
    var d = new DHDialog();      // Begin to use it freely
  } else {
    // In this part, you need not to declare it cause you do not use it.
  }
  ...........
</script>
(end)

Through the example you must now comprehend the use of <$dh.Require>, right? Moreover, there are some more useful functions as follow
- Allow to load complex modules by using one function:
(start code)
    $dh.Require("ctrl/control1,control2,control3","util/util1,util2")
(end)
- Allow to load javascript and CSS in runtime
(start code)
$dh.Require("css/file1,file2,file3", "css")
$dh.Require(["ctrl/control1", "ctrl/control2"],"js")
(end)
- Avoid loading one module more than one time
In example above, whether you declare *$dh.Require("ctrl/dialog”)* many times or not, there are only a file will 
be loaded. This will decrease loading script overlap and avoiding errors related. ( For example: each time a module
 is loaded, all of variables you are using will be re-initiate -> bad result ).
You can also check whether or not a module has been loaded with *$dh.isLoaded(modulePath)*.

I will describe how to mark a module as loaded in the following chapter.


2.4. Some points which can be improved:
After receiving many appreciated comments, I intend to rearrange core module in a more reasonable way in order to
 help you to fully understand DHTiny
+ Put some AJAX or CSS process away from core, make core simpler.
+ Remake the inline method above
+ Add some popular utility functions in some programming languages ( for example: each,map,collect,inject…)
+ Distribute ScriptBuilder, a tool creates automaticlly a unify javascript file where has you need for your program. And compress details in order to load page faster.

I will improve these points and attach instructions to share knowledge with everyone. The old utility functions will not be changed, therefore you can continue to use DHTiny without worries of the change in old functions or some errors may be occurred.


Section: 3. Built-in modules

3.1. Utilities:

DhTiny provides some Utilities which can be accessed through folder *[dhtinyroot]\util*.

Noticeably
- event.js: Contain definition of interface controlling events of DHTiny. This applies for all events occur on DOM, and events defined by users as well.
- dragmanager.js: Contain definition and initiating module that manage Drag&Drop Event. Can be used by including this module into program
- animation.js: Define animations from simple to complex, varying from series to parallel process. Applying this module, users can create a new interface
and edit animation sequences on browser in a similar form to Macromedia Flash. Its special feature is this provides fairly enough functions within only 400 code lines.
- color.js: Contain utilities processing target color, especially useful for animation requires color changing effect
- date.js: Calculate and process date and time

Those modules mentioned above have been in DhTiny since the very beginning, so in due time, we need to improve them to be more simplified and catch up with processing speed.
Usually, all DhTiny's Visual controls use more than one module utilities, in order to comprehend more about these modules, please look through our introduction on Visual controls, API resource and library source codes for details.

3.2. Visual Controls:

DHTiny's Visual Controls (Visible, clickable targets) are placed inside *[dhtiny]\ctrl* foder. We keep adding visual controls in DHTiny through practical needs to develop more applications.
You can found most familiar targets from other websites in this Visual Control lists
- imagebutton: A button embed with image and label, can change image and shape when clicked.
- calendar: Display date and time in form of calendar table.
- dialog: Similar to Windows' dialog, can display and hidden information according to situation flexibly.
- treeview: Display tree structure like in Windows, help arranging data tidily.
- slider: Can be used to change value of Visual controls (Changing color, relocate media player, etc.)
- dockpanel: Panel fixed into 1 of 4 corners of window, can be displayed/hidden

Beside above controls, DHTiny also provides complicated controls for multi-purpose uses:
- animitem: Help build and manage animation effects efficiently in easiest way.
- imagescroller: Establish a film strip like image scroll, work as ads banner or to show multiple images in one frame at same time(one product photos for example)
- animplayer: Create a frame controlling javascript animation effects supported by DHTiny, can edit optionally to make a multi-use mediaplayer.

These visual controls can be input in program by using syntax *$dh.Require("ctrl/controlName")*. 
Let's see the making of this object in details in the analytical part below.


Section: 4. How does DHTiny support Object Oriented Programming?

For the people who has not grab the concrete basics, let's explain a little about this Object Oriented Programming (OOP).

Let's begin with a story, there is an usual button on the web. Those elements like that called "object". Object shares some same traits,
like in Button's case, normally they resemble in shape (sticking a label above, embed by a contour outline..), above all they react
in the same way (when clicked it prompt off an event). Each apparent feature of an object (shape, label) is called Object's "Attribute",
each reaction according to user's operation is called "Method" of an Object.

A Class can be considered as a mold to shape (span) objects. By creating a mold (prototype), you can mass-produce homogenous objects as much as you want.
In popular Object Oriented Programing (C++, Java,..) people set up the rule to define Class, Class'keywords, to the extent that the existence of Class considered
vitally to the program.

However, in javascript there's no such a keyword so-called "class" at all. Up until now, they used to write down lots of functions just to process work on the client side,
ironically however no one think of building a class-like thing to reuse the source code when necessary. One of the main reason is: before the era of Web 2.0, Client's script solely 
does the simple tasks, while source code is the combination of numerous discrete functions serving "instant noodle style" process on site.
As time passed by, the volume for Javascript processing getting large and larger, especially in client-intended applications (RIA - Rich Internet Application),
the usage of those already messed up "instant-noodle" javascript has become improper.

4.1. Basic defined Class in Javascript:

Usually, any Function in javascript can be treated and used as a class. We can define as:

(start code)
function MyClass1(name) {
    // *this* here implies anything else but "this function/class".
    // We can freely add properties and Attributes (for example "name") through variable *this*
    this.name = name; 
}
(end)   

Or
(start code)
MyClass2 = function(name) {
    this.name = name;
    this.sayHello = function() {
        // Define processing Method for class
        alert("Hi, my name is " + this.name);
    }
}
(end)

The result is we can span Objects from these classes (moulds)

(start code)
var obj1 = new MyClass1("Tommy");
alert(obj1.name);  // Give out defined Attribute

var obj2 = new MyClass2("Gina");
obj2.sayHello(); // Give defined Method
(end)

For an arbitary object in javascript, we can optionally add attributes to it:
(start code)
obj2.age = 25;
obj2.sayGoodbye = function () { alert("Goodbye!"); }   

// Call out what we just defined
alert(obj2.age);
obj2.sayGoodbye();
(end)

As you might see, anything that is defined through this will be contained inside class.
But for things that defined after object is created (Attribute obj2.age or method obj2.sayGoodbye)
will only exist in target, not affecting the Class at all.

One question comes to mind, how to change an already existed class? In details, how to add or replace functions for class after it was created?
This is the part for Prototype (mold)

Let me remind: class can be seen as a mold to make object. Each function is javascript is provided with
enough properties to become a class, a mold in other word. The way we define attributes through variable "this" before is identical to inputting
attributes into this mold.

To concrete the stance, let's see the example below
(start code)
// Initially, this class spans a target displaying a person with 2 attributes: name and age
function Person( name, age) {
    this.name = name;
    this.age = age;
}
var person1 = new Person( "Peter", 23); // Object person1 containts both attributes name:Peter and age:23

// What if we want to add another attribute and method into class?
// Prototype needs changing
Person.prototype.talkable = "yes";
Person.prototype.sayHello = function() { alert("Hello!"); }

var person2 = new Persion("Mary", 21); // Object person2 will have name as Mary and age:21
person2.sayHello(); // person2 is talkable

// Print out talkable attribute. the result "yes" will be seen
alert("Is person2 talkable? " + person2.talkable);
(end)

Another interesting point, did you know that once prototype is changed, all objects that born from class will be change as well. Run the script below to check up

(start code)
person1.sayHello();
(end)

You can recognize that at the time when person1 is created, there was no such method as sayHello. After applying this method in to prototype, immediately even object person1 can
access to this method. To summarize, (prototype) rule every mass-produced objects.

While defining multiple attributes and methods, have you ever felt bothered going through "this" or "prototype", reluctantly texting the same text over and over?
We got another solution in stead

(start code)
// Define an empty class
function Person() { }
    // Supply arbitrary attributes in JSON syntax (Wiki JSON for further details)
    Person.prototype = {
        name: "DefaultName",
        age:    "DefaultAge",
        sayHello: function() {
            alert("Hello!");
        },
        .....
        .....
    }         
(end)

This is my favorite way of coding before learning more of Javascript. However each time giving
(start code)
person = new Person();
(end)
is still impossible passing parameter to function Person, even executing a function after person was created is not runable. That's why
we need to show you DHTiny solution

4.2. DHTiny Style:
 
 If you already got used to ordinary class definition of Javascript, especially on prototype and JSON parts, you will quickly get hand on
 this part. When use DHTiny, you can create a class by using following function *$dh.newClass*. Sample:
 (start code)
$dh.newClass("Person", {
    name: "DefaultName",
    age:  "DefaultAge",

    init: function(name, age ) {
        this.name = name;
        this.age = age;
    },

    sayHello: function() {
        alert("Hello!");
    },
    ......
    // We continue defining attributes, methods with arbitrary number
});
   
// Let's create an object
// This object will have name and age appointed by following parameter
var person = new Person("Peter", 25);
(end)
 
Furthermore, DHTiny also provides capability to create whole new classes succeeding already existed classes.
In this case, let's create a new class: class Student, which is built upon succeeding attributes from class Person

(start code)
$dh.newClass("Student", Person, {
    init: function(name, age, studentID) {
        this.name = name;
        this.age = age;
        this.studentID = studentID;
    },
    showID: function() {
        alert("My ID is "+ this.studentID);
    }
    ....
    ....
});

// Create this object
// This object contains enough attributes of Person, come in addition with a new attribute unique only to Student class we just defined.
var student = new Student("Peter", 25, "No123");
(end)

DHTiny also allow inheriting multiple classes, succeeding arbitrary objects at same time:
For example:

(start code)
// Assuming GamePlayer, BikeRider are existed classes
// We can add in following arbitrary object
anyInfo = {
    userid: "guest",
    password: "guest12" 
}

$dh.newClass("Student", Person, GamePlayer, BikeRider, anyInfo,  {
    init: function(name, age, studentID) {
        this.name = name;
        this.age = age;
        this.studentID = studentID;
    },
    showID: function() {
        alert("My ID is "+ this.studentID);
    }
    ....
    ....
});   
(end)

You can reuse attributes of class/object as much as you want. In case of repeating function name
between defined class and succeeding class, it is up to you to replace over existed method or to edit in existing one. For example

(start code)
$dh.newClass("Student", Person, GamePlayer, BikeRider, anyInfo,  {
    init: function(name, age, studentID) {
        // Give method of mother's object
        Person.prototype.init.apply(this,[name, age]);

        // Writing your own execution
        this.studentID = studentID;
    },       
    
    // Replace over existed method in class Person
    sayHello: function() {
        alert("Hi, my name is " + this.name);
    }
    ....
    ....
});   
(end)

DHTiny also tributes possibility to check how many objects from 1 class are created, to access each object consecutively,
to track back which classes did current class succeed from... For further details, please look through API documents.

To understand more of programing method on creating successive class as above, please check through source code of DHTiny's core.
The code is fairly short and easy to comprehend. Through FAQ, if necessary, I can gather to make a more detailed post on this topic.   

Section: 5. Key classes at a glance (incompleted)

In this section, I will describe more details about key classes, from which almost all DHTiny classes are inheriting functions.

1. <DHRichCanvas>:

This is one of fundamental class, plays an key role in building Visual controls for DhTiny library. With ability to process CSS and basic events,
it allows user to create a Visual control with desired attributes easily without requiring complicated operations.

By taking a closer look to DHTiny source code, you can see that many built-in controls of DHTiny have been created based on this class.
If you want to write your own controls, <DHRichCanvas> may be totally enough to get started.


2. <DHEvent>:

This simple class is written based on observer pattern. It provides the ability for you to create/ manage custom events on any kind of object freely.


3. <DHAnimItem>:

This class is the combination of DHRichCanvas and DHMotion, which help you to control animation effects on DOM element even easier.
   
   
Section: 6. Steps to write your own modules using DHTiny

6.1. Make your needs, ideas clear:
The importance is to understand what properties does the thing you write need to have, then the next step will be dividing works to do it efficiently. If goal is set since the beginning
you can save your time by reusing existed modules in library, then to complete the product all need is just adding some lines.

Take a look at following example:

You need to create a control in form of slideshow. The main frame containing photos is place in the middle, surrounding by forward backward arrows on both sides, moving to next photos
when clicked. Everytime shifting to next photos, image can go expand, fly out, zoom out, fade off,... vividly. Frame size, button size and shape, image source links and images list can be altered by parameter.

(** First step for planning is to figure out your work by description **)

Immediately after understanding your needs, please recheck again DHTiny library to find what can be utilized 

+ Use an object AnimationItem as a frame for animation effects
+ Use ImageList to load images with best speed possible
+ ImageButton for 2 clickable buttons

The rest up to you is just to create a link to images, input images into display list, and set up the animations.
It might sound difficult as long as you hesitate starting it, so why not give it a try right after this?
Due to limitation of this introduction, let's get into the bottom of this topic in other discussion.

6.2. Start writing source code:

+ First step is to make a class. An empty class with declaration of preceding class, and name for few necessary attributes and methods is fine.
(For example attribute: imagePath, method: goNext(), goPrevious()...)
+ Then included it in program and run for check up
+ After making sure there is no error, let's create smaller elements by creating objects in existed class
(this.nextButton = new DHImageButton(...); will help make a clickable button, inserting parameter for image link and it can be used on screen right away.
Keep adding parameters until you get enough needed elements)
+ Write additional execution. For example: To choose how image will pop up when clicked back or forward button; deciding proper animation effect.
+ Make all this attributes variable if possible. For example: left-align of backward button was set at 10px at the beginning, but after tested, change it back into parameter so that user can freely
add desired value to change left position.
+ It would be great to leave some comments after each operations, so we can review this again afterward.

6.3. Declare your work through DHTiny:

We'd gladly welcome you to commit source code in DHTiny's repository on Assembla. We will choose the best of all products to discuss and rate, finally
putting it into latest package releasing to community. Please do not mind leaving your name and contact on top of each important file source code, so that
everyone can ask questions during product usage.


Happy coding with DHTiny!

DHTiny development team:


*/
