#!/usr/bin/env node
console.time("time");

var mysql = require('mysql');
var m = require('mathjs');
var u = require('underscore');

var array_populacao_experimento = [10, 20, 30, 40, 50, 60, 80, 90, 100];
var experimento = 1
var tc = 0.75, tm = 0.01, qtd_geracoes = 10, qtd_pop = 0, qtd_bits = 50, melhor_aptidao = 0.0;
var pop = new Array(),aptdao_sum = new Array(),pais = new Array(),aptidao_pop = new Array(),filhos = new Array(),mais_apto = new Array();
var aptidao_pop_total_experimento = new Array();
var qtd_mutacoes_experimento = 0, cont_geracao = 0;

for(aux1 in array_populacao_experimento){
	for(aux2 in u.range(3)){
		qtd_pop = array_populacao_experimento[aux1];
		play_ag();
		experimento++;
		zerar_variaveis();
	}
}


function zerar_variaveis(){
	pop = [];aptdao_sum = [];pais = [];aptidao_pop = [];filhos = [];mais_apto = [];
	aptidao_pop_total_experimento = [];
	qtd_mutacoes_experimento = 0; cont_geracao = 0; melhor_aptidao = 0.0;
}

function play_ag(){
	inicializar(qtd_pop, qtd_bits);
	avaliar();
	for(geracao in u.range(parseInt(qtd_geracoes)-1)){
		cont_geracao = parseInt(geracao) + 1;
		reproduzir();
		avaliar();
		console.log('experimento/geração: '+experimento+'/'+cont_geracao);
	}

	console.log('Melhor aptidão: '+melhor_aptidao);

	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '12345678',
	  database : 'ag',
	  port     : '3306'
	});

	connection.connect();
	var cont = 0;
	connection.query('INSERT INTO experimento (pop_inicial, melhor_indv, quantidade_mutacoes) VALUES (?,?,?)', [qtd_pop,melhor_aptidao,qtd_mutacoes_experimento], function(err,res){
		if(err) throw err;
		console.log('experimento inserido com sucesso');
	});
	cont=0;
	for(i in aptidao_pop_total_experimento){
		connection.query('INSERT INTO individuos (id_experimento, aptidao, geracao) VALUES (?,?,?)', [experimento,aptidao_pop_total_experimento[i][0],aptidao_pop_total_experimento[i][1]], function(err,res){
			if(err) throw err;
			console.log('grupo de individuos '+ cont+++' inserido com sucesso');
		});
	}

	connection.end();
}

//***********************FUNÇÕES******************************

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
		aptidao_pop_total_experimento.push([f6(bin2Float(x_string),bin2Float(y_string)),cont_geracao]);
	}
}

function reproduzir(){
	var soma_aptidao = 0;
	aptdao_sum = [];

	for(i in aptidao_pop){
		soma_aptidao += aptidao_pop[i];
		aptdao_sum.push(soma_aptidao);
	}
	filhos=[];
	selecionar(soma_aptidao);
	//filhos.push(select_mais_apto());
	
	while(filhos.length < pop.length){
		if(Math.random() <= tc){
			cruzamento();
			selecionar(soma_aptidao);
		}
	}
	filhos[m.randomInt(filhos.length)] = mais_apto;
	aptidao_pop = [];
	pop = [];
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
			if(Math.random() <= tm){
				pop[i][j] = (pop[i][j] == 0) ? 1 : 0;
				qtd_mutacoes_experimento++;
			}
		}
	}
}

function selecionar(soma_aptidao){
	select_mais_apto();
	var rand = m.random(0,soma_aptidao);

	for(i in aptdao_sum){
		if (aptdao_sum[i] >= rand){
			pais.push(pop[i]);
			rand = m.random(0,soma_aptidao);
			//aptdao_sum[i] = 0.01; //pog
		}
		if(pais.length == 2)
			break;
	}
	if(pais.length < 2)
		selecionar(soma_aptidao);
}

function select_mais_apto(){
	for(i in aptidao_pop){
		if(aptidao_pop[i] > melhor_aptidao){
			mais_apto = pop[i];
			melhor_aptidao = aptidao_pop[i];
		}
	}
	//return mais_apto;
}

function media_array(array){
	var sum = 0;
	for( var i = 0; i < array.length; i++ )
	    sum += array[i]; 

	return sum/array.length;
}

console.timeEnd("time");