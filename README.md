# node-servoy

## What is this

```node-servoy``` is a Node.JS library which emulates a small part of the Servoy-specific Javascript API through extensive use of ```async/await```.

## Implementation

Right now it implements:

- JSDataSet
- databaseManager (just enough to create servers and query JSDataSet)
- plugins.mail
- plugins.http
- plugins.file
- plugins.rawSQL

There is only one database driver implemented: PostgreSQL.

## Parser

It also implements a parser that lets you convert ```.frm``` and ```.dbi``` files to JSON objects. This will let you build dependency trees between forms or automatically generate documentation.

## Contributing

Contributions are welcome if they meet the ESLint quality guidelines. Pull requests that include unit tests are preferred.

## License

```
MIT License

Copyright (c) 2017 Jaapjan Tinbergen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```