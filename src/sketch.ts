// P5 Sketch
import { scaleQuantize } from 'd3';
import * as COL from 'd3-color';

import p5 from 'p5';
let p: p5;

export default class Sketch {

    public currentLineT = 0;
    private p: p5;
    private currenWeather = {};
    private prevWeather = {};
    private mping:any = {};
    private currentOr = { x: 50, y: 100, dir: 2, wid: 2, col: "" as string };
    private nextOr = { x: 0, y: 0, dir:0,wid:2,col:"" as string };
    private currentT = 0;
    constructor( instance: p5 ) {
        this.currentLineT = 0;
        this.p = instance;
        p = this.p;
        console.log( 'test' );
    }

    public  setup = async () =>  {
        console.log( new Date() );
        console.log('test2');
        p.createCanvas(
            window.innerWidth,
            window.innerHeight
        );
        p.frameRate( 60 );
        p.background( 255 );
        this.currentLineT = 0;
        this.mping = {
            temp: ( i: number ) => {
                return p.map( i, 8, 50, 0, 360 );
            },
            ws: ( i: number ) => {
                return p.map( i, 5, 30, 2, 5 );
            },
            hum: (i:any) => p.map( i, 20, 100, 40, 70 ),
            chr: ( i: any ) => p.map( i, 0, 60, 30, 80 ),
            brightness: ( i: any ) => {
                return p.map( i, 0, 24, 40, 100 );
            }

        };
        p.loadJSON(
            'http://www.bom.gov.au/fwo/IDV60901/IDV60901.95936.json',
            ( o: any, i: any ) => {
                console.log( 'received' );
                this.currenWeather = o;
                const dta = o.observations.data[0];
                this.nextOr.wid = this.mping.ws( dta.wind_spd_kmh );
                const hue = this.mping.temp( dta.air_temp );
                this.nextOr.dir = p.random( 0, p.PI );
                const chroma = this.mping.hum( dta.rel_hum );
                this.nextOr.col = COL.hcl(hue,80,chroma).hex();

            },'json',() => console.log('call failed')
        );

    }
    public draw = () => {
        if ( this.currentT > 9999 ) p.noLoop();
        this.currentLineT = this.currentLineT + 1;
        if ( this.currentLineT === 260 ) {
            this.newLine();
        }

        p.noFill();
        p.stroke( this.currentOr.col );
        p.strokeWeight( this.currentOr.wid );
        const org = p.createVector( this.currentOr.x, this.currentOr.y );
        const dist = p.map( this.currentLineT, 0, 260, 0.1, 20 );
        // firstLine
        const p1 = p5.Vector.add(p.createVector(0,1).rotate(this.currentOr.dir).setMag(dist),org);
        const p2 = p5.Vector.add( p.createVector(0,1).rotate( this.currentOr.dir + p.PI ).setMag( dist ), org );
        p.line( org.x, org.y, p1.x, p1.y );
        p.line( org.x, org.y, p2.x, p2.y );
        
     }
    public newLine = () => {
        this.currentLineT = 0;
        this.currentT++;
        this.currentOr = this.nextOr;
        this.currentOr.x = p.random( 20+(p.width-20) );
        this.currentOr.y = p.random( 20 + ( p.height - 20 ) );
        p.loadJSON(
            'http://www.bom.gov.au/fwo/IDV60901/IDV60901.95936.json',
            ( o: any, i: any ) => {
                console.log( 'received' );
                this.currenWeather = o;
                const dta = o.observations.data[0];
                this.nextOr.wid = this.mping.ws( dta.wind_spd_kmh );
                const hue = this.mping.temp( dta.air_temp );
                this.nextOr.dir = p.random( 0, p.PI );
                const chroma = this.mping.hum( dta.rel_hum );
                this.nextOr.col = COL.hcl(hue,80,chroma).hex();

            },'json',() => console.log('call failed')
        );

    }
}   
