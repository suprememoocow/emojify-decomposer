# Emojify.js decomposer

Who doesn't love emojis? Nobody. Ever. Emojify.js is a great library for working with this, but the emoji's are baked
into the CSS using data urls. This makes the download very large. This may be a problem if your application has
large download footprint already or needs to load with minimal downloads.

This utility allows you to extract the individual pngs out into their own files, making the upfront download size
much smaller (for all the emojis, it's about 70K right now)

###To use it

Clone this module, then

```
git submodule foreach --recursive git submodule sync
git submodule update --init --recursive

node extract.js
```

The output will be in the output/ directory.