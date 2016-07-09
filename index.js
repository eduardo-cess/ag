#!/usr/bin/env node
console.time("time");

var m = require('mathjs');
var u = require('underscore');


var geracao = 0, tc = 0.75, tm = 0.01;
var pop = new Array(), aptdao_sum = new Array(), pais = new Array(), aptidao_pop = new Array();

inicializar(10, 50);
avaliar();
reproduzir();
//wt(pop[0]);






function bin2Float(binary){
	var scope = {
		l: binary.length,
		xmin: -100,
		xmax: 100,
		i: parseInt(binary, 2)
	};
	return m.eval('xmin+(i*(xmax-xmin)/((2^l)-1))',scope);
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

function inicializar(qtd_pop, qtd_bits){
	var cromossomo = new Array();
	var bit;
	for(i in u.range(qtd_pop)){
		for(j in u.range(qtd_bits))
			cromossomo.push(m.randomInt(2));
		pop.push(cromossomo);
		cromossomo = [];
	}
}

function avaliar(){
	var x, x_string, y, y_string;

	for(i in pop){
		x = pop[i].slice(0,25);
		y = pop[i].slice(25,50);	
		x_string = String(x).replace(/,/g , "");
		y_string = String(y).replace(/,/g , "");
		//wt("x: "+x_string+" float: "+bin2Float(x_string)+' int: '+parseInt(x_string, 2));
		//wt("y: "+y_string+" float: "+bin2Float(y_string)+' int: '+parseInt(y_string, 2));
		pop[i].push(f6(bin2Float(x_string),bin2Float(y_string)));
	}
}

function reproduzir(){
	var filhos = new Array(), soma = 0;
	for(i in pop){
		soma += u.last(pop[i]);
		aptdao_sum.push(soma);
	}

	selecionar(soma);
	wt(pais);
}

function cruzamento(){

}

function mutacao(){

}

function selecionar(soma_aptidao){
	var rand = m.random(0,soma_aptidao);

	for(i in aptdao_sum){
		if (aptdao_sum[i] >= rand){
			pais.push(pop[i]);
			rand = m.random(0,soma_aptidao);
			aptdao_sum[i] = 0;
		}
		if(pais.length == 2)
			break;
		wt(u.last(pop[i]));
		wt(rand);
		wt('');
	}
	if(pais.length < 2)
		selecionar(soma_aptidao);
}

console.timeEnd("time");