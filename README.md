#a one page cms

to use you need to make a SHA1 hash of a password and save it as password.txt in the root folder of the app. the username is presently hardcoded. you wanted to be named will anyway, right?

you should make an empty text file called savedState.txt to persist your post over crashes.

requires image magick for the image upload stuff in the post interface (it resizes). You also need to have a 'uploads' folder in '/assets/public' for uploads to work.

#license

MIT 2014 [http://whatsim.mit-license.org](http://whatsim.mit-license.org)