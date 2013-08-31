
Array.prototype.has = function(v) {
    for (var i = 0; i < this.length; i++) {
	if (this[i] === v) {
	    return true;
	}
    }
    return false;
};

Array.prototype.removeByPosition = function(from, to) {
    if (from === undefined || to === undefined) {
	return this;
    }
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.removeByContent = function(content) {
    for (var i = 0; i < this.length; i++) {
	if (this[i] === content) {
	    this.removeByPosition(i, i);
	}
    }
};

String.prototype.replaceAll = function(find, replace) {
    var str = this;
    str = str.replace(new RegExp(find, 'g'), replace);
    return str;
};

String.prototype.trim = function trim(str, chars) {
    return this.rtrim(chars).ltrim(chars);
}

String.prototype.ltrim = function(chars) {
    var str = this;
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

String.prototype.rtrim = function(chars) {
    var str = this;
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

String.prototype.isEmpty = function() {
    return this === undefined || this === null || this.trim() === '';
}

