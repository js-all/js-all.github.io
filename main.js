// les constante du jeu
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;
const startD = new Date();
const ml = 10;
const pattern = [65, 85, 84, 79];
const nrettap = [68, 68, 68, 68];
const p2 =      [32, 32, 32, 32];
const lhs = localStorage.getItem('hs');

// les variables du jeu
var pI = 0;
var Ip = 0;
var Pi = 0; 
var playerSprite = 0;
var groundOffsetLeft = 0;
var backgroundOffsetLeft = 0;
var autoInterval = null;
var autoT = 30;
var autos = 0;
var dead = false;
var scoreC = 0;
var scoreCA = 1;
var minC = 0;
var secC = 0;
var hsC = 0;
var hsCA = 1;
var au = false;
var god = null;
var hs;
var bbs = false;
var rss = 0;
var rsc = new rgb.white();
var comb = 1;
var ndc = 0;
var ttp = localStorage.getItem('ttp');
var tsecC = 0;
var tminC = 0;

// definition des variables si besoin
if (lhs === null) {
    hs = 0;
    localStorage.setItem('hs', '0');
} else {
    let nhs = parseInt(lhs);
    if (isNaN(nhs)) {
        
        hs = 0;
        localStorage.setItem('hs', '0');
    } else {
        
        hs = nhs;
        localStorage.setItem('hs', hs.toString());
    }
}
if (ttp === null) {
    ttp = 0;
    localStorage.setItem('ttp', '0');
} else {
    let ntp = parseInt(ttp);
    if (isNaN(ntp)) {
        ttp = 0;
        localStorage.setItem('ttp', '0');
    } else {
        ttp = ntp;
    }
}

//empeche le flou lors du zoom
ctx.imageSmoothingEnabled = false;



//les classes
class element {
    constructor(width, height, color, x, y, id = 'element' + element.intances.length) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;

        let found = false;
        for (let i of element.intances) {
            if (id === i.id) {
                found = true;
            }
        }
        if (found) {
            console.warn('an element width id ' + id + ' already exist, so the element id is ' + 'element' + element.intances.length);
            Object.defineProperty(this, 'id', {
                value: 'element' + element.intances.length,
                writable: false
            });
        } else {
            Object.defineProperty(this, 'id', {
                value: id,
                writable: false
            });
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    static getElmentById(id) {
        let el = null;
        for (let i of element.intances) {
            if (i.id === id) {
                el = i;
            }
        }
        return el;
    }
}


class entity extends element {

    constructor(width, height, ImgPath, x, y, life, id = 'element' + element.intances.length, hitBoxColor = new rgb.random(), hitBox = false) {
        super(width, height, 'black', x, y, id);
        this.setSprite(ImgPath);
        this.life = life;
        this.alive = true;
        hitBoxColor.alpha = 0.5;
        this.color = hitBoxColor.value;
    }
    damage(int = 1) {
        this.life -= int;
        if (this.life <= 0) {
            this.alive = false;
        }
    }
    touch(ent) {
        if (!ent instanceof entity) throw new TypeError('ent must be an entity');
        let X = false;
        let Y = false;
        let entXW = ent.x + ent.width;
        let entYH = ent.y + ent.height;
        let thisXW = this.x + this.width;
        let thisYH = this.y + this.height;
        if ((thisXW <= entXW & thisXW >= ent.x) || (this.x <= entXW & this.x >= ent.x)) X = true;
        if ((thisYH <= entYH & thisYH >= ent.y) || (this.y <= entYH & this.y >= ent.y)) Y = true;
        let res = false;
        if (Y && X) res = true;
        return res;
    }
    setSprite(ImgPath) {
        let sprite = new Image();
        sprite.src = ImgPath;
        this.sprite = sprite;
    }
    draw() {
        if (this.hitBox) ctx.fillStyle = this.color;
        if (this.hitBox) ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

class fireball extends entity {

    constructor(pos) {
        let p = ch / 2 - (300 - 210);
        super(100, 99, './sprite/fireball/spawn/0.png', cw - 100, p + (pos * 100) + (p === 2 ? 10 : 0), 1);
        this.instancesIndexOf = fireball.intances.length;
        fireball.intances.push(this);
        this.dead = false;
        this.deleted = false;
        this.finnalyDead = false;
        this.pos = pos;
        this.floatState = 0;
        setTimeout(() => {
            this.setSprite('./sprite/fireball/spawn/1.png');
            setTimeout(() => {
                this.setSprite('./sprite/fireball/spawn/2.png');
                this.move(this);
            }, fireball.w)
        }, fireball.w);
    }
    touch(ent) {
        if (this.deleted) return false;
        if (!ent instanceof entity) throw new TypeError('ent must be an entity');
        let X = false;
        let Y = false;
        let entXW = ent.x + ent.width;
        let entYH = ent.y + ent.height;
        let thisYH = this.y + this.height;
        if (entXW >= this.x - (32 - 100)) X = true;
        if ((thisYH <= entYH & thisYH >= ent.y) || (this.y <= entYH & this.y >= ent.y)) Y = true;
        let res = false;
        if (Y && X) res = true;
        return res;
    }
    move(fb) {
        if (this.deleted) return;
        fb.x -= 25;
        if (fb.floatState === 0) fb.y -= 4;
        if (fb.floatState === 1) fb.y += 4;
        fb.setSprite('./sprite/fireball/move/' + fb.floatState + '.png');
        fb.floatState = fb.floatState === 0 ? 1 : 0;
        fireball.rate += 0.2;
        fireball.rate = fireball.rate > 30 ? 30 : fireball.rate;

        if (fb.touch(wall)) {
            fb.dead = true;
            fb.kill();
            ndc++;
            if (ndc > 10) {
                comb = 1.5;
            }
            if (ndc > 50) {
                comb = 2;
            }
            if (ndc > 150) {
                comb = 4;
            }
            if (ndc < 10) {
                comb = 1;
            }
            if (player.alive) player.score += Math.floor(fireball.rate * comb);
        }
        if (fb.touch(player)) {
            player.damage();
            fb.dead = true;
            fb.kill();
            ndc = 0;
        }
        if (!fb.dead) {
            setTimeout(fb.move, 1000 / fireball.rate, fb);
        }
    }
    kill(new_ = true) {
        if (fireball.rate >= 30) fireball.w -= 2;
        if (fireball.w < 0 && fireball.fp === undefined) {
            if (new_) new fireball(0);
            fireball.fp = 100;
        }
        if (fireball.fp !== undefined && fireball.intances.length <= 3) {
            if (fireball.fp < 0) {
                fireball.fp = 100;
                if (new_) new fireball(0);
            } else if (fireball.fp > 0) {
                fireball.fp--;
            }
        }
        this.dead = true;
        this.setSprite('./sprite/fireball/explode/0.png');
        setTimeout(() => {
            this.setSprite('./sprite/fireball/explode/1.png');
            setTimeout(() => {
                this.setSprite('./sprite/fireball/explode/2.png');
                setTimeout(() => {
                    this.setSprite('./sprite/fireball/explode/3.png');
                    setTimeout(() => {
                        this.finnalyDead = true;
                        if (new_) new fireball(Math.floor(Math.random() * 3));
                    }, fireball.w);
                }, fireball.w);
            }, fireball.w);
        }, fireball.w);
    }
}
// proprieter static des classes
fireball.rate = 15;
fireball.intances = [];
fireball.w = 100;
element.intances = [];



// les entiter principal du jeu
const player = new entity(300, 300, './sprite/player/0.png', 0, ch / 2 - (300 - 200), ml, 'player', new rgb.red());
player.score = 0;
const ground = new entity(2020, 500, './sprite/ground/0.png', 0, (ch / 2 + 200), 99999999, 'ground', new rgb.grey());
const wall = new entity(100, 95, './sprite/wall/0.png', 250, ch / 2 - (300 - 210), 1, 'wall', new rgb.blue());
const original_fireball = new fireball(1);
const background = new entity(2000, 1000, './sprite/background/0.png', 0, 0, 0);


wall.pos = 0;
wall.oldPos = 0;
wall.move = false;
wall.up = function () {
    if (wall.pos !== 0) {
        wall.oldPos = wall.pos;
        wall.pos--;
    }
}

wall.down = function () {
    if (wall.pos !== 2) {
        wall.oldPos = wall.pos;
        wall.pos++;
    }
}

// les function principallment des boucles
function changeBackgroundOffset() {
    background.x = 0 - backgroundOffsetLeft;
    backgroundOffsetLeft += 5;
    if (backgroundOffsetLeft >= 1000) backgroundOffsetLeft = 0;
    changeBackgroundOffset.rate += 0.01;
    changeBackgroundOffset.rate = changeBackgroundOffset.rate > 30 ? 30 : changeBackgroundOffset.rate;
    window.setTimeout(changeBackgroundOffset, 1000 / changeBackgroundOffset.rate);
}

function changePlayerSprite() {
    let nps = playerSprite + 1 > 3 ? 0 : playerSprite + 1;
    playerSprite = nps;
    player.setSprite('./sprite/player/' + nps + '.png');
    changePlayerSprite.rate += 0.01;
    changePlayerSprite.rate = changePlayerSprite.rate > 30 ? 30 : changePlayerSprite.rate;
    window.setTimeout(changePlayerSprite, 1000 / changePlayerSprite.rate);
}

function changeGroundOffset() {
    ground.x = 0 - groundOffsetLeft;
    groundOffsetLeft += 30;
    if (groundOffsetLeft >= 1020) groundOffsetLeft = 0;
    changeGroundOffset.rate += 0.01;
    changeGroundOffset.rate = changeGroundOffset.rate > 30 ? 30 : changeGroundOffset.rate;
    window.setTimeout(changeGroundOffset, 1000 / changeGroundOffset.rate);
}
// le rendu
function draw() {
    const {
        min,
        sec
    } = msToMinAndSec(timeBetweenTwoDatesInMs(startD, new Date()));
    ctx.clearRect(0, 0, cw, ch);
    if (!dead) {
        background.draw();
        player.draw();
        wall.draw();
        ground.draw();
        for (let i of fireball.intances) {
            if (!i.finnalyDead) i.draw();
        }
        ctx.font = '30px "Geo", serif';
        ctx.fillStyle = "white";
        let sec_ = sec.toString().length == 1 ? '0' + sec : sec;
        ctx.fillText(min + ':' + sec_, cw - 100, 50);
        ctx.fillText('score: ' + player.score, 50, 100);
        ctx.fillStyle = 'black';
        ctx.fillRect(50, 25, 400, 50);
        ctx.fillStyle = new rgb(120, 0, 0).value;
        ctx.fillRect(55, 30, 390, 40);
        let pr = (player.life / ml) * 390;
        pr = pr < 0 ? 0 : pr;
        ctx.fillStyle = new rgb(0, 120, 0).value;
        ctx.fillRect(55, 30, pr, 40);
        let pl = (player.life / ml) * 100;
        ctx.fillStyle = 'white';
        ctx.fillText(pl+'%', 225, 57)
        if (autoInterval !== null) {
            if (autoT <= 0) {
                autoT = 30;
                autos = autos === 0 ? 1 : 0;
            } else {
                autoT--;
            }
            if (autos === 0) {
                ctx.fillStyle = 'green';
                ctx.fillText('AUTO', cw - 100, 100);
            }
        }
        let ec = 75;
        if (comb === 1) {
            ctx.fillStyle = 'white'; 
        } else if (comb === 1.5) {
            ctx.fillStyle = 'green';
            ec = 98
        } else if (comb === 2) {
            ctx.fillStyle = 'orange'
        } else if (comb === 4) {
            ctx.fillStyle = 'red';
        }
        ctx.fillText('x'+comb, cw - ec, 75);
    } else {
        background.draw();
        ctx.fillStyle = rsc.value;
                ctx.fillText('press R to restart', 370, 650);
                if (rss === 0) {
                    if (rsc.alpha > 0) {
                        rsc.alpha -= 0.05;
                    } else {
                        rss = 1;
                    }
                } else if (rss = 1) {
                    if (rsc.alpha < 1) {
                        rsc.alpha += 0.05;
                    } else {
                        rss = 0;
                    }
                }
        ctx.fillStyle = 'white';
        ctx.font = '300px "Geo", serif';
        ctx.fillText('GAME', 190, 200);
        ctx.fillText('OVER', 225, 430);
        let ft = bbs ? ' (best score !)' : '';
        if (scoreC < player.score) {
            ctx.font = '30px "Geo", serif';
            ctx.fillText('score: ' + scoreC, 190, 500);
            scoreC += Math.floor(scoreCA);
            scoreCA += 1;
        } else if (scoreC >= player.score) {

            scoreC = player.score;
            ctx.font = '30px "Geo", serif';
            ctx.fillText('score: ' + scoreC + ft, 190, 500);
            if (au) {
                ctx.fillText('auto: yes', 190, 530);
            } else {
                ctx.fillText('auto: never', 190, 530);
            }
            const {
                min,
                sec
            } = msToMinAndSec(timeBetweenTwoDatesInMs(startD, god));
            if (secC < sec) {
                secC++;
            } else if (secC === sec) {
                if (minC < min) {
                    minC++;
                }
            }
            let secC_ = secC.toString().length == 1 ? '0' + secC : secC;
            ctx.fillText(`time: ${minC}:${secC_}`, 190, 560);
            if (hsC < hs) {
                ctx.fillText('hi score: ' + hsC, 190, 590);
                hsC += Math.floor(hsCA);
                hsCA += 10;
            } else if (hsC >= hs) {
                hsC = hs;
                ctx.fillText('hi score: ' + hsC, 190, 590);
                const {
                    sec: tsec,
                    min: tmin
                } = msToMinAndSec(ttp);
                if (tsecC < tsec) {
                    tsecC++;
                } else if (tsecC === tsec) {
                    if (tminC < tmin) {
                        tminC++;
                    }
                }
                let tsecC_ = tsecC.toString().length === 1 ? '0'+tsecC : tsecC;
                ctx.fillText(`total time: ${tminC}:${tsecC_}`, 190, 620);

            }
        }
    }
}

function play() {
    let p = ch / 2 - (300 - 210);
    if (wall.pos === 0) {
        if (wall.oldPos !== wall.pos) {
            wall.y = p;
        }
    } else if (wall.pos === 1) {
        if (wall.oldPos !== wall.pos) {
            wall.y = p + 100 * 1;
        }
    } else if (wall.pos === 2) {
        if (wall.oldPos !== wall.pos) {
            wall.y = p + 100 * 2
        }
    }
    if (!player.alive) {
        gameOver();
    }
}

function gameOver() {
    document.addEventListener('keydown', e => {
        if (e.keyCode === 82) {
            location.reload();
        }
    });
    if (player.score > hs) {
        
        hs = player.score;
        bbs = true;
        localStorage.setItem('hs', player.score.toString());
    }
    dead = true;
    for (let i of fireball.intances) {
        i.kill(false);
    }
    god = new Date();
    ttp += timeBetweenTwoDatesInMs(startD, god);
    localStorage.setItem('ttp', ttp.toString());
    clearInterval(play.interval);
}

document.addEventListener('keydown', e => {
    if (e.keyCode === 38) {
        wall.up();
    } else if (e.keyCode === 40) {
        wall.down();
    }
    if (e.keyCode === pattern[pI]) {
        if (pI !== pattern.length - 1) {
            pI++;
        } else {
            if (autoInterval === null) {
                auto();
            } else {
                clearInterval(autoInterval);
                autoInterval = null;
            }
            pI = 0;
        }
    } else if (e.keyCode === nrettap[Ip]) {
        if (Ip !== nrettap.length -1) {

            Ip++
        } else {
            player.damage(ml);
            Ip = 0;
        }
    } else if (e.keyCode === p2[Pi]) {
        if (Pi === p2.length -1) {
            if (wall.height === 300) {
                wall.height = 95;
            } else {
                wall.height  = 300;
            }
            Pi = 0;
        } else {
            Pi++;
        }

    } else {
        pI = 0;
        Ip = 0;
        Pi = 0;
    }
});
draw.rate = 30;
play.rate = 10;
changePlayerSprite.rate = 5;
changeGroundOffset.rate = 5;
changeBackgroundOffset.rate = 10;
changeGroundOffset();
changePlayerSprite();
changeBackgroundOffset();

draw.interval = setInterval(draw, 1000 / draw.rate);
play.interval = setInterval(play, 1000 / play.rate);
let ppp = 0;

// bonus pour fair jouer un robot
function auto() {
    au = true;
    autoInterval = setInterval(() => {
        let ffb;
        for (let i of fireball.intances) {
            if (ffb === undefined & !i.dead) {
                ffb = i;
            }
        }
        if (ffb === undefined) return;
        let fbp = ffb.pos;
        if (ffb.pos === wall.pos) return;
        if (wall.pos === 0) {
            if (fbp === 1) {
                wall.down();
            } else if (fbp === 2) {
                wall.down();
                wall.down();
            }
        } else if (wall.pos === 1) {
            if (fbp === 0) {
                wall.up();
            } else if (fbp === 2) {
                wall.down();
            }
        } else if (wall.pos === 2) {
            if (fbp === 0) {
                wall.up();
                wall.up();
            } else if (fbp === 1) {
                wall.up();
            }
        }
    }, 1);
}
// fonction utils
function timeBetweenTwoDatesInMs(d1, d2) {
    return d2.getTime() - d1.getTime();
}

function msToMinAndSec(ms) {
    let min = Math.floor((ms / 1000) / 60);
    let sec = Math.floor(ms / 1000 - min * 60);
    return {
        min: min,
        sec: sec
    }
}