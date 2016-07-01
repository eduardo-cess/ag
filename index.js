#!/usr/bin/env node

m = require('mathjs');




wt(bin2Dec('-10000010110111000011'));
// for (var i = -100; i < 100; i++) {
// 	wt(f6(i,2));

// }

function bin2Dec(binary){
	return parseInt(binary, 2);
}


function f6(x,y){
	var scope = {
		x: x,
		y: y
	};

	return m.eval('0.5-(((sin(sqrt(x^2+y^2)))^2)-0.5)/(1+0.001*(x^2+y^2))^2',scope);
}

function wt(texto){
	console.log(texto);
}

function inicializar(){

}

function avaliar(){

}

function cruzamento(){

}

function mutacao(){

}

function selecionar(){

}