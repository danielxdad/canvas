function Line() {
    this.x = 0;
    this.y = 0;
    this.last_x = this.xmid;
    this.last_y = this.ymid;
    this.angle = 0.0;
    this.radio = 1;
    this.inc_radio = 1;
    this.shadow = false;
    this.h = 100 * Math.random() + 1;
    this.hInterval = null;

    with (context) {
        shadowOffsetX = 1.7;
        shadowOffsetY = 1.7;
        shadowBlur = 0.1;
        shadowColor = '#0C0C0C';
        lineCap = 'round';
    }

    this.setEvalInput = function(idInputX, idInputY) {
        if ((typeof idInputX != 'string') || (typeof idInputY != 'string')) {
            throw 'El tipo de parametro es invalido';
        }

        this.idInputX = idInputX;
        this.idInputY = idInputY;
    }

    this.evalInput = function(idInput) {
        let val = document.getElementById(idInput).value;

        if (!val.length || val == undefined) {
            throw new Error('El valor de entrada esta vacio');
        }

        let ret = (new Function('return ' + val))();

        if (typeof ret !== 'number') {
            throw new Error('El valor devuelto no es un numero\r\nTipo: ' + typeof ret + '\r\nValor: ' + String(ret));
        }

        return ret;
    }

    this.lineHSL = function(line) {
        if (typeof line != 'object') {
            throw new Error('El tipo de parametro es invalido');
        }

        context.save();
        context.beginPath();
        context.shadowColor = 'hsl(' + line.hue + ', ' + line.saturation + ', ' + line.light + ')';
        context.shadowBlur = 15;
        context.lineWidth = line.width;
        context.strokeStyle = 'hsl(' + line.hue + ', ' + line.saturation + ', ' + line.light + ')';
        context.moveTo(line.fromX, line.fromY);
        context.lineTo(line.toX, line.toY);
        context.stroke();
        context.restore();
    }

    this.do_shadow = function(rect) {
        if (typeof rect !== 'object') {
            throw new Error('El parametro no es valido');
        }

        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    this.timeAnimation = function() {
        try {
            this.x = this.evalInput(this.idInputX);
            this.y = this.evalInput(this.idInputY);
        } catch (err) {
            pix.clearInterval()
            console.error(err);
            alert(err.name + ': ' + err.message);
            throw err;
        }

        this.radio += this.inc_radio;
        this.angle += this.inc_angle;

        if (this.angle > Math.PI * 2) {
            this.angle %= (Math.PI * 2);
        }

        if (this.shadow) {
            this.do_shadow({ x: 0, y: 0, width: canvas.width, height: canvas.height });
        }

        this.h += 5 * Math.random();
        this.lineHSL({
            hue: this.h,
            saturation: '50%',
            light: '50%',
            width: Math.sqrt(Math.abs(this.radio)),
            fromX: this.last_x,
            fromY: this.last_y,
            toX: this.x,
            toY: this.y,
        });

        this.last_x = this.x;
        this.last_y = this.y;

        if (Math.abs(this.radio) >= 170) {
            this.inc_radio *= -1;
        }
    }

    this.clearInterval = function() {
        if (typeof this.hInterval === 'number') {
            clearInterval(this.hInterval);
        }

        this.hInterval = null;
    }
}
