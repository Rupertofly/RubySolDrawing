
// P5 Sketch
import p5 from 'p5';
import Sketch from './sketch';
const instance = new p5( is => {
    const sk = new Sketch( is );
    is.setup = sk.setup;
    is.draw = sk.draw;
    console.log( is );
});
