#Procedural Generation

Using Perlin noise to create procedural terrain.

How do I run the programs?
--------------------------

1. First, you'll need to clone the repository.
2. Next, you'll need to install node and bower. These
  programs are a part of the node.js platform. You can get node from 
  [here](https://nodejs.org/ "Node Download") and you can use npm
  (one of the programs included in node.js) to install 
  [bower](http://bower.io/ "Bower"), with
  a simple `npm install -g bower`. The `-g` installs it globally,
  which is usually what you want.
3. Now you can get the dependencies for the project. From the root
  project directory, just run the commands `node install` and 
  `bower install` and the dependencies enumerated in the manifest
  files should be downloaded. You may need to run one or both commands
  as an administrator (e.g. with `sudo` and the password).
4. Some of the programs will cause problems in Chrome because they 
  try to access the file system. I usually fix this by using a simple
  web server called 
  [Mongoose](http://cesanta.com/mongoose.shtml "Mongoose"). Once downloaded,
  stick Mongoose in your root project directory and run it.
5. Now if you browse (I recommend Chrome) to the index.html file 
  in the root directory (or to localhost:8080 if you're using a server), 
  you should be able to navigate to the WebGL programs.

