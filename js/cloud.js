

/*
 * Class for working with tag-cloud.
 *
 * Create an instance of this class, passing
 * necessary parameters as a fields of an anonymous
 * object. For example:
 * 
 * new Clouder({
 *     container: document.getElementById("cloud-container"),
 *     tags: [...],
 *     callback: function(id) {alert(id);}
 * });
 *
 * Only two parameters are requirred ("container" and "tags"),
 * all other are optional and have some default value.
 * Recognized parameter-field names:
 * - container (required) - DOM element of container (usually <div> block)
 *     into which to place the tag cloud sphere
 * - tags (required) - descriptors for tags - little objects
 *     consisting of three fields - "text" which
 *     will be shown as a floating tag, "id"
 *     which will be passed to callback function when tag
 *     is clicked, and "weight" (or significance, value) of a tag
 *     which controls the color of a tag.
 * - callback - function which is called when tag clicked,
 *     its only parameter is an "id" of a clicked tag.
 *     by default - simple internal function alerting tag id.
 * - fontSize - average font size for tags, by default 14.
 * - fontShift - maximal deviation of font size,
 *     nearest objects are shown in (fontSize + fontShift),
 *     furthes ones are shown in (fontSize - fontShift),
 *     by default (fontSize / 2).
 * - colorMax - color for most significant elements,
 *     only in "#xxxxxx" (hexadecimal) notation,
 *     by default "#000000".
 * - colorMin - color for least significant elements,
 *     only in "#xxxxxx" (hexadecimal) notation,
 *     by default "#C0C0C0".
 * - colorBgr - background color for container element,
 *     by default not specified (inherited).
 * - interval - timer interval for redraw (milliseconds),
 *     by default 50ms.
 * - stepAngle - sphere rotation angle performed on each
 *     timed redraw, if mouse pointer is close to border
 *     of a container (multiply by 1.414 if close to corner)
 *     by default ~0.174 radians (10 degrees).
 * - idleMotion - rotation speed ration when mouse pointer leaves container
 *     by default 0.2.
 * - opaque - opacity ratio for elements on far back side of globe,
 *     opacity increases when element turns on front side (up to 1.0)
 *     by default 0.4.
 * - xScale - sphere size scaling horizontal coefficient, allows to
 *     make sphere wider (if greater than 1.0) or narrower (if less than 1.0)
 *     than container element
 *     by default 0.9
 * - yScale - sphere size scaling vertical coefficient - same as xScale
 *     but increases or decreases the screen "height" of the sphere.
 *     by default 0.9
 * - scale - sphere size scaling coefficient (shortcut for setting both
 *     xScale and yScale equal and simultaneously).
 * - nonSense - insensitivity zone width (at center of container) - rotation
 *     stops when mouse is here (for easier clicking). varies from 0 (no zone
 *     at all) to 1 (whole container width and height).
 *     by default 0.025.
 */
function Clouder(params) {

    var self = this;
    var w, h, lastX, lastY;
    var rho = 0, theta = 0;
    var timer = null;
    var closest = null;
    var containerTop;
    var containerLeft;
    var timing = [1];
    var timingMax = 8;

    var container;
    var callback;
    var fontSize, fontShift;
    var colorMax, colorMin, colorBgr;
    var xScale = 0.8, yScale = 0.8;
    var interval = 150;
    var stepAngle = 0.14722;
    var idleMotion = 0;
    var nonSense = 0.005;
    var opaque = 0.4;
    
    
    var objs = [];
    
    
    function init() {
    
        setupElems(params.tags);
        w = container.clientWidth;
        h = container.clientHeight;
        process(function(o){o.span = null;});
        
        if (colorBgr) {
            container.style.backgroundColor = colorBgr;
        } // if
        
        draw();
        
        timer = setInterval(onTimer, interval);
        containerTop = container.offsetTop;
        containerLeft = container.offsetLeft;
        container.onmousemove = onMouseMove;
        container.onmouseleave = onMouseLeave;
        container.onclick = onClick;
    } // init
    
    
    function onMouseMove(e) {
        if(!e) {
            e = window.event;
        } // if
        
        setPos(e.clientX, e.clientY);
        
        setClosest(findClosest(e.clientX - containerLeft, e.clientY - containerTop));
    } // onMouseMove
    
    
    function onMouseLeave(e) {
        if (!e) {
            e = window.event;
        } // if
        
        rho = idleMotion;
        setClosest(null);
    } // onMouseLeave
    
    
    function setupElems(elems) {
        
        for (var e in elems) {
            var c = {};
            c.text = elems[e].text;
            c.id = elems[e].id;
            c.weight = elems[e].weight;
            c.x = 1;
            c.y = 0;
            c.z = 0;
            spin(c, (Math.random() * 2 - 1) * Math.PI);
            step(c, (Math.random() * 2 - 1) * Math.PI);
            spin(c, (Math.random() * 2 - 1) * Math.PI);
            objs.push(c);
        } // for
        
    } // setupElems
    
    
    function adjustElems() {
        
        for (var i in objs) {
            var dx = 0, dy = 0, dz = 0;
            var o = objs[i];
            for (var j in objs) {
                if (i == j) {
                    continue;
                } // if
                var diffX = o.x - objs[j].x;
                var diffY = o.y - objs[j].y;
                var diffZ = o.z - objs[j].z;
                var r = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
                dx += 0.05 / (r * r) * diffX / r;
                dy += 0.05 / (r * r) * diffY / r;
                dz += 0.05 / (r * r) * diffZ / r;
            } // for
            
            o.x += dx;
            o.y += dy;
            o.z += dz;
            var dist = Math.sqrt(o.x * o.x + o.y * o.y + o.z * o.z);
            o.x /= dist;
            o.y /= dist;
            o.z /= dist;
        } // for
        
    } // adjustElems
    
    
    function sign(a) {
        return a > 0 ? 1 : (a < 0 ? -1 : 0);
    } // sign
    
    
    function setPos(x, y) {
        x = (lastX = x - container.offsetLeft) * 1.2 / w - 1;
        x = (Math.abs(x) < nonSense ? 0 : (x - nonSense * sign(x)) / (1 - nonSense)) / xScale;
        y = (lastY = y - container.offsetTop) * 1.8 / h - 1;
        y = (Math.abs(y) < nonSense ? 0 : (y - nonSense * sign(y)) / (1 - nonSense)) / yScale;
        theta = Math.atan2(y, x);
        rho = Math.sqrt(x * x + y * y);
    } // setPos
    
    
    function draw() {
        var filters = (typeof(document.body.filters) == "object");

        process(function(o) {
            
            if (o.span == null) {
                o.span = document.createElement("span");
                o.width = 0;
                o.height = 0;
                o.span.innerHTML = o.text;
                o.span.style.fontWeight = "bold";
                o.span.style.position = "absolute";
                var c = 1;
                for (var i in colorMax) {
                    c = c * 256 + Math.floor((colorMax[i] - colorMin[i]) * o.weight + colorMin[i]);
                } // for
                o.span.style.color = "#" + c.toString(16).substr(1);
                container.appendChild(o.span);
                o.span.descriptor = o;
            } // if
            
            var size = fontSize + o.z * fontShift;
            o.factor = size / fontSize;
            if (o.width == 0) {
                o.width = o.span.clientWidth / o.factor;
                o.height = o.span.clientHeight / o.factor;
            } // if
            o.span.style.fontSize = Math.round(size);
            o.screenX = w * (o.x * xScale + 1) / 2;
            o.span.style.left = o.screenX - o.width * o.factor / 2;
            o.screenY = h * (o.y * yScale + 1) / 2;
            o.span.style.top = o.screenY - o.height * o.factor / 2;
            o.span.style.zIndex = o.z >= 0 ? 10 : 5;
            var opa = (Math.sin(o.z * Math.PI / 2) / 2 + 0.5) * (1 - opaque) + opaque;
            if (!filters) {
                o.span.style.opacity = opa;
            } else {
                var f = o.span.filters["DXImageTransform.Microsoft.Alpha"];
                if (f) {
                    f.opacity = opa * 100;
                } else {
                    o.span.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity=" + (opa * 100) + ")";
                } // else
            } // else
        });
        
    } // draw
    
    
    function findClosest(ex, ey) {

        var bestDist = w + h;
        var best = null;
        for (var i in objs) {
            var o = objs[i];
            var dx = ex - o.screenX;
            var dy = ey - o.screenY;
            var dist = Math.sqrt(dx * dx + dy * dy) / o.factor;
            if (dist < bestDist) {
                bestDist = dist;
                best = o;
            } // if
        } // for
        
        return best;
    } // findClosest
    
    
   /* function setClosest(obj) {
        
        if (closest == obj) {
            return;
        } // if
        
        if (closest != null) {
            closest.span.style.border = "";
        } // if
        closest = obj;
        
        if (closest != null) {
            closest.span.style.border = "1px solid black";
        } // if
        
    } // setClosest */
    
    
    function onTimer() {
        var t0 = new Date().getTime();
        
        var move = function(o) {
            spin(o, -theta);
            step(o, rho * stepAngle);
            spin(o, theta);
        }; // move
        
        process(move);
        adjustElems();
        draw();
        
        setClosest(findClosest(lastX, lastY));
        
        timing.push(new Date().getTime() - t0);
        if (timing.length > timingMax) {
            timing.splice(0, timing.length - timingMax);
        } // if
    } // onTimer
    
    
    function spin(o, angle) {
        var x = o.x;
        var y = o.y;
        o.x = x * Math.cos(angle) - y * Math.sin(angle);
        o.y = x * Math.sin(angle) + y * Math.cos(angle);
    } // spin
        
        
    function step(o, angle) {
        var x = o.x;
        var z = o.z;
        o.x = x * Math.cos(angle) - z * Math.sin(angle);
        o.z = x * Math.sin(angle) + z * Math.cos(angle);
    } // step
    
    
    function onClick(event) {
        
        if (closest == null || closest.id == null) {
            return;
        } // if
        
        callback(closest.id);
    } // spanClicked
    
    
    function process(func) {
        for (var i in objs) {
            func(objs[i]);
        } // for
    } // process
        
    
    function parseColor(text) {
        var hex = parseInt(text.substr(1), 16);
        return [Math.floor(hex / 65536), Math.floor((hex / 256) % 256), Math.floor(hex % 256)];
    } // parseColor
    
    
    function parametrize(p) {
        
        if (!p.container) {
            alert("Clouder could not be created without container!");
            throw "Clouder without container";
        } // if
        
        container = p.container;
        
        if (!p.tags) {
            alert("Clouder could not be crated without tags!");
            throw "Clouder without tags";
        } // if
        
        callback = p.callback ? p.callback : function(id) { alert(id); };
        fontSize = p.fontSize ? p.fontSize : 16;
        fontShift = typeof(p.fontShift) != "undefined" ? p.fontShift : fontSize / 2;
        colorMax = p.colorMax ? parseColor(p.colorMax) : parseColor("#000000");
        colorMin = p.colorMin ? parseColor(p.colorMin) : parseColor("#C0C0C0");
        colorBgr = p.colorBgr ? p.colorBgr : null;
        interval = typeof(p.interval) != "undefined" ? p.interval : interval;
        stepAngle = typeof(p.stepAngle) != "undefined" ? p.stepAngle : stepAngle;
        idleMotion = typeof(p.idleMotion) != "undefined" ? p.idleMotion : idleMotion;
        opaque = typeof(p.opaque) != "undefined" ? p.opaque : opaque;
        nonSense = typeof(p.nonSense) != "undefined" ? p.nonSense : nonSense;
        if (typeof(p.scale) != "undefined") {
            xScale = yScale = p.scale;
        } // if
        xScale = typeof(p.xScale) != "undefined" ? p.xScale : xScale;
        yScale = typeof(p.yScale) != "undefined" ? p.yScale : yScale;
    } // parametrize
    
    
    self.getRenderingTime = function() {
        var sum = 0;
        for (var i in timing) {
            sum += timing[i];
        } // for
        return sum / timing.length;
    }; // getRenderingTime
    
    self.kill = function() {
        clearInterval(timer);
        process(function(o){o.span.parentNode.removeChild(o.span);});
    }; // kill
    
    
    parametrize(params);
    
    init();
    
} // Clouder

