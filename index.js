#!/usr/bin/env node
console.time("time");

m = require('mathjs');
u = require('underscore');
//$ = require('jquery');

pop = new Array();
aptidao_pop = new Array();
geracao = 0
tc = 0.75;
tm = 0.01;

inicializar(10, 50);
avaliar();
wt(aptidao_pop);









function bin2Float(binary){
	var scope = {
		l: binary.length,
		xmin: -100,
		xmax: 100,
		i: parseInt(binary, 2)
	};
	return m.eval('xmin+((xmax-xmin)/(2^l-1)*i)',scope);
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
			cromossomo.push(m.randomInt(2))
		pop.push(cromossomo);
		cromossomo = [];
	}
}

function avaliar(){
	var x = new Array();
	var y = new Array();

	for(i in pop){
		for(j in pop[i]){
			if(j < pop[i].length/2)
				x.push(pop[i][j]);
			else
				y.push(pop[i][j]);
		}
		aptidao_pop.push(f6(bin2Float(x),bin2Float(y)));
		x=[];y=[];
	}
}

function reproduzir(){
	var aptdao_sum = new Array();
	var soma = 0;
	for(i in aptidao_pop){
		soma += aptidao_pop[i];
		aptdao_sum.push(soma);
	}

	if(m.random(0,soma))



}

function cruzamento(){

}

function mutacao(){

}

function selecionar(){

}

console.timeEnd("time");