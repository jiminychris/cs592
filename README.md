#Procedural Generation

Using Perlin noise to create procedural terrain.

How do I look at the programs NOW?
----------------------------------

Navigate to http://jiminychris.com/cs592/.

How do I run the programs on my machine?
----------------------------------------

1. First, you'll need to clone the repository.
2. [Install node.js]((https://nodejs.org/ "Node.js")).
3. Run `npm install -g bower` to
  [install bower](http://bower.io/ "Bower").
4. Run `npm install -g browserify to
  [install browserify](http://browserify.org/ "Browserify").
5. While in the root directory, run `sudo npm install; bower install`.
4. To build each program, go into each directory with an `index.html`
  file and run the command `browserify js/index.js -o bundle.js`.
5. Some of the programs will cause problems in Chrome because they 
  try to access the file system. I usually fix this by using a simple
  web server called 
  [Mongoose](http://cesanta.com/mongoose.shtml "Mongoose"). Once downloaded,
  stick Mongoose in your root project directory and run it.
6. Now if you browse (I recommend Chrome) to the index.html file 
  in the root directory (or to localhost:8080 if you're using a server), 
  you should be able to navigate to the WebGL programs.

