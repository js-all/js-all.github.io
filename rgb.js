/**
 * js-all 2018 tout droits non reservé
 * 
 */ 
class rgb {
   /**
    *  @class
    *  @constructor 
    *  @param {Number} [red] - La valeur de rouge dans la couleur. Si non préciser prend la valeur defini dans rgb.config.defaultColor.red.
    *  @param {Number} [green] - La valeur de vert dans la couleur. Si non préciser prend la valeur defini dans rgb.config.defaultColor.green.
    *  @param {Number} [blue] - La valeur de bleu dans la couleur. Si non préciser prend la valeur defini dans rgb.config.defaultColor.blue.
    *  @param {Number} [alpha] - La tansparance de la couleur, valeur entre 0 et 1. Si non préciser prend la valeur defini dans rgb.config.defaultAlpha.
    */
    constructor(red = rgb.config.defaultColor.red, green = rgb.config.defaultColor.green, blue = rgb.config.defaultColor.blue, alpha = rgb.config.defaultAlpha) {
        if (typeof red != 'number' || typeof green != 'number' || typeof blue != 'number') {
            throw new TypeError("rgb, constructor: all params type must be number");
        }
        this.red = red;
        this.green = green;
        this.blue = blue;
        if (typeof alpha == 'number') {
            if (alpha >= 0 & alpha <= 1) {
                this.alpha = alpha;
            } else {
                throw new Error("rgb, constructor: alpha params value must be betwin 0 and 1 (0 and 1 include)")
            }
        } else {
            throw new TypeError("rgb, constructor: type of param alha must be number");
        }
    }
    /**
     * renvoi la couleur sou forme de string. exemple: new rgb(0, 255, 0, 1).get() renvoi "rgba(0, 255, 0, 1)"
     * @param {boolean} [alpha = true] - precise si la transparence de la couleure doir etre donne. example new rgb(0, 255, 0, 1).get() renvoie "rgba(0, 255, 0, 1)" alors que new rgb(0, 255, 0, 1).get(false) renvoie "rgb(0, 255, 0)", si non preciser prend true.
     */
    get(alpha = true) {
        if (typeof alpha != 'boolean') {
            throw new TypeError("rgb, get: alpha type must be a boolean");
        }
        let res = `(${this.red}, ${this.green}, ${this.blue}`;
        if (alpha) {
            res = 'rgba' + res + ' ,' + this.alpha + ')';
        } else {
            res = 'rgb' + res + ')';
        }
        return res;
    }
    /**
     * Augmente la luminositer de la couleur.
     * @param {Number} [bright = 20] - la valeur de l'eclairssicement.
     */
    brighter(bright = 20) {
        if (typeof bright != 'number') {
            throw new TypeError("rgb, brighter: bright params type must be a number");
        }
        this.red += bright;
        this.green += bright;
        this.blue += bright;
        return this;
    }
    /** Baisse la luminositer de la couleur.
      * @param {Number} [dark = 20] - la valeur de l'assombricement. Si non preciser prend 20.
      */
    darker(dark = 20) {
        if (typeof dark != 'number') {
            throw new TypeError("rgb, darker: dark params type must be a number");
        }
        this.red -= dark;
        this.green -= dark;
        this.blue -= dark;
        return this;
    }
    /** 
     * La meme chose que get() mais ranvoi de l'hexadecimal.
     */
    getHex() {
        let alpha = false;
        let red = this.red < 255 ? this.red < 0 ? 0 : this.red : 255;
        let green = this.green < 255 ? this.green < 0 ? 0 : this.green : 255;
        let blue = this.blue < 255 ? this.blue < 0 ? 0 : this.blue : 255;
        let sred = red.toString(16);
        let sgreen = green.toString(16);
        let sblue = blue.toString(16);
        let Sred = sred.length == 2 ? sred : '0' + sred;
        let Sgreen = sgreen.length == 2 ? sgreen : '0' + sgreen;
        let Sblue = sblue.length == 2 ? sblue : '0' + sblue;
        let res = `#${Sred}${Sgreen}${Sblue}`;
        if (alpha) {
            res += (255 * ((Math.round(this.alpha) * 100) / 100)).toString(16);
        }
        return res;
    }
    /**
     * inverse la couleur
     */
    
    invert() {
        this.red = 255 - this.red;
        this.green = 255 - this.green;
        this.blue = 255 - this.blue;
        return this;
    }
    /**  affiche la couleure dans la console.
      *  @param {any} log - text à afficher en dessous de la couleure.
      *  @param {any[]} logParam - parametre du text a afficher comme dans console.log().
      */
    logColor(log, ...logParam) {
        let strr = log == undefined ? "" : "\n" + log;
        let br = 10;
        let unit = 'px';
        let op = `color: ${this.get()};background-color: ${this.get()};`;
        let opp = op + 'border-top-left-radius:' + br + unit + ';border-top-right-radius:' + br + unit + ';';
        let oppp = op + 'border-bottom-left-radius:' + br + unit + ';border-bottom-right-radius:' + br + unit + ';';
        console.log('%c_----_\n' +
                    '%c......\n' +
                    '%c-____-%c' +
            strr,
            opp, op, oppp, '', ...logParam);
        return this;
    }
    to(percent) {
        if (percent < 0 || percent > 100) {
            throw new Error('rgb, to : pecent param value must be betwin 0 and 100 (0 and 100 include)');
        }
        
    }
}
rgb.random = class {
    /**
     * @class rgb.random creé une couleure aleatoire.
     * @constructor
     * @param {boolean} [alph = false] - si true genere une couleure aleatoire avec un alpha aleatoire, si false genere une couleur avec 1 comme alpha.  
     * @returns {rgb}
     */
    constructor(alpha = false) {
        let c = new rgb();
        c.red = Math.floor(Math.random() * ((255 - 0) + 1) + 0);
        c.green = Math.floor(Math.random() * ((255 - 0) + 1) + 0);
        c.blue = Math.floor(Math.random() * ((255 - 0) + 1) + 0);
        if (alpha) {
            c.alpha = Math.floor(Math.random() * ((100 - 0) + 1) + 0) / 100;
        }
        return c;
    }
};
rgb.red = class {
    /**
     * @class rgb.red crée une couleure rouge
     * @constructor
     * @returns {rgb}
     */
    constructor() {
        return new rgb(255, 0, 0);
    }
};
rgb.green = class {
    /**
     * @class rgb.green crée une couleure verte
     * @constructor
     * @returns {rgb}
     */
    constructor() {
        return new rgb(0, 255, 0);
    }
};
/**
 * @class rgb.blue crée une couleure bleu
 * @constructor new rgb.blue()
 * @returns {rgb}
 */
rgb.blue = class {
    
    constructor() {
        return new rgb(0, 0, 255);
    }
};
rgb.black = class {
    /**
     * @class rgb.black crée une couleure noire
     * @constructor
     * @returns {rgb}
     */
    constructor() {
        return new rgb();
    }
};
rgb.white = class {
    /**
     * @class rgb.white crée une couleure blanche
     * @constructor
     * @returns {rgb}
     */
    constructor() {
        return new rgb().invert();
    }
};
rgb.grey = class {
    /**
     * @class rgb.grey crée une couleure grise
     * @constructor
     * @returns {rgb}
     */
    constructor() {
        return new rgb().brighter(122.5);
    }
};
rgb.copy = class {
    /**
     * @class rgb.copy copie une couleure
     * @constructor
     * @returns {rgb}
     */
    constructor(c, alpha = true) {
        if (!c instanceof rgb) {
            throw new TypeError("rgb.copy, please pass a rgb in constructor");
        }
        let res = new rgb(c.red, c.green, c.blue);
        if (alpha) {
            res.alpha = c.alpha;
        }
        return res;
    }
};
rgb.config = {
    warn: true,
    defaultColor: {
        red: 0,
        green: 0,
        blue: 0
    },
    defaultAlpha: 1
}
rgb.config.codeLogColor = {
    new: new rgb(198, 120, 221),
    white: new rgb.white(),
    bg: new rgb(40, 44, 52),
    red: new rgb(255, 80, 80),
    class: new rgb(229, 192, 107),
    boolean: new rgb(237, 151, 101),
    info: new rgb(0,0,0)
};
function loc(c) {
    return "color:"+c.get()+";";
}
rgb.help = function(...helps) {
    for (let i = 0;i < helps.length;i++) {
        const help = helps[i];
        const code = rgb.config.codeLogColor;
        if (help == rgb.config) {
            console.info('%cthe config of rgb class for set his default color and other things.',loc(code.info))
        } else if (help == rgb.config.warn) {
            console.info('%cdefault value: %ctrue%c\nactive or unactive rgb warn.',loc(code.info),loc(code.boolean),loc(code.info))
        } else if (help == rgb.config.defaultColor) {

        } else if (help == rgb.config.defaultAlpha) {

        } else if (help == rgb.config.codeLogColor) {

        } else {
            console.info("%chelp, not found or not writed.",loc(code.info))
        }
    }
}