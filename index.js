#!/usr/bin/env node
console.time("time");

var m = require('mathjs');
var u = require('underscore');

var tc = 0.75, tm = 0.01, qtd_geracoes = 100, qtd_pop = 100, qtd_bits = 50;
var pop = new Array(), aptdao_sum = new Array(), pais = new Array(), aptidao_pop = new Array(), filhos = new Array();

inicializar(qtd_pop, qtd_bits);
avaliar();
for(geracao in u.range(qtd_geracoes)){
	reproduzir();
	avaliar();
	wt('geração: '+geracao);
}

wt(aptidao_pop);





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
		//pop[i].push(f6(bin2Float(x_string),bin2Float(y_string)));
		aptidao_pop.push(f6(bin2Float(x_string),bin2Float(y_string)));
	}
}

function reproduzir(){
	var soma_aptidao = 0;
	aptdao_sum = [];

	for(i in aptidao_pop){
		soma_aptidao += aptidao_pop[i];
		aptdao_sum.push(soma_aptidao);
	}
	
	selecionar(soma_aptidao);
	
	while(filhos.length < pop.length){
		if(Math.random() <= tc){
			cruzamento();
			selecionar(soma_aptidao);
		}
	}
	aptidao_pop = [];
	pop = filhos;

	mutacao();
}

function cruzamento(){
	var filho;
	filho = pais[0].slice(0,25)+pais[1].slice(25,50);
	filhos.push(String(filho).replace(/,/g , ""));
	filho = '';
	filho = pais[1].slice(0,25)+pais[0].slice(25,50);
	filhos.push(String(filho).replace(/,/g , ""));
	filho = '';
	pais = [];
}

function mutacao(){
	for(i in pop){
		for(j in pop[i]){
			if(Math.random() <= tm)
				pop[i][j] = (pop[i][j] == 0) ? 1 : 0;
		}
	}
}

function selecionar(soma_aptidao){
	var rand = m.random(0,soma_aptidao);

	for(i in aptdao_sum){
		if (aptdao_sum[i] >= rand){
			pais.push(pop[i]);
			rand = m.random(0,soma_aptidao);
			aptdao_sum[i] = 0.01; //pog
		}
		if(pais.length == 2)
			break;
	}
	if(pais.length < 2)
		selecionar(soma_aptidao);
}

console.timeEnd("time");