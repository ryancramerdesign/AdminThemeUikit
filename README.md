# Uikit 3 admin theme module 

### Requires ProcessWire 3.0.62 or newer

Currently in development and testing. Do not attempt to install on 
ProcessWire versions prior to 3.0.62 or you will get a fatal error.

This admin theme is intended as a starting point and framework for 
Uikit-based admin themes. For the most part it uses the stock Uikit
look-and-feel, which is very minimal. We have not attempted to design
an admin theme here and instead have focused on getting the framework
in place so that others can come in and lead on the design side.

### Uikit CSS development with this admin theme

This module uses a custom Uikit theme developed in the manner outlined here: 
<https://getuikit.com/docs/less>. 

When we are creating production CSS, we execute `npm run compile` in the `uikit/` 
directory, as outlined on that page. The admin theme uses the resulting CSS file
located in `uikit/dist/css/uikit.pw.min.css`. It takes a little while to run that
full compile, so it's not ideal for development.

During development, we instead use the `uikit/custom/pw.css` file. In my case,
PhpStorm automatically generates this file every time I make a change to any 
of the .less files. If you also want to use that development file, edit the 
`AdminThemeUikit.module` file and update the `const dev = false;` to
`const dev = true;`. This will put the admin theme into development mode, which
makes it use the development CSS file, and also disables navigation caching, so
that you see changes instantly. Remember to change it back to `false` once you 
are production ready.

### Upgrading the Uikit version

As of the time this is written, Uikit 3 is in beta and seems to have new versions
available almost every time I check. As a result, I upgrade it often. If you'd like 
to do the same, here's one way to go about it: 

1. Rename the current `/uikit/` directory to `/uikit-old/`. Don't delete or overwrite it yet!

2. Download or clone the latest Uikit from <https://github.com/uikit/uikit> and
   place it into `/uikit/`. 

3. Copy the `/uikit-old/custom/` directory to `/uikit/custom/`. This is the directory that contains
   the custom ProcessWire Uikit theme. 
   
4. Re-compile Uikit (or just the CSS). For more info see:
  - [Compile Uikit from GitHub source](https://getuikit.com/docs/installation#compile-from-github-source)
  - [Uikit build processes](https://getuikit.com/docs/less)
  
5. Feel free to delete the `/uikit-old/` directory when you have successfully upgraded Uikit.  


