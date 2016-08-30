var codigo  = 0;
var inativo = 0;
$(function(){
	if(document.getElementById("ck-inativo").checked == true){		
		inativo = 1;
		document.getElementById("btn-detalhe").style = "";		
	}
	AtualizaCliente();
	AtualizaGrupos();
});
$('#row-table').on('click','tr',function(){
	var table = $('#table-usuario');
	table.find('tr').each(function(indice){		
		$(this).removeClass('active');			
	})
	$(this).addClass('active');
	codigo = $(this).find('td')[0].innerHTML;
	$('#inputNome2').attr('value',$(this).find('td')[1].innerHTML);	
	$('#inputTelefone2').val($(this).find('td')[2].innerHTML);
	$('#inputEmail2').attr('value',$(this).find('td')[3].innerHTML);

	var comboGrupo = document.getElementById("lista-grupo2");
	for(i = 0; i < comboGrupo.length; i = i+1){
		if(comboGrupo.options[i].text == $(this).find('td')[4].innerHTML){
			var posicao = i;
		}
	}
	comboGrupo.selectedIndex = posicao;
});
$('#txt-pesquisa').keypress(function(event){
	if (event.which == 13) { //EnterKey
		Pesquisar();
	}
});
$('#ck-inativo').on('click',function(){
	if(document.getElementById("ck-inativo").checked == true){
		inativo = 1;
		$('#btn-excluir').removeClass('btn btn-danger');
		$('#btn-excluir').addClass('btn btn-success');
		document.getElementById("btn-excluir").innerHTML = "Ativar";
		document.getElementById("btn-detalhe").style = "";
	}else{
		inativo = 0;		
		$('#btn-excluir').removeClass('btn btn-success');
		$('#btn-excluir').addClass('btn btn-danger');
		document.getElementById("btn-excluir").innerHTML = "Desativar";
		document.getElementById("btn-detalhe").style = "display:none";
	}
	ResetaTable();
	AtualizaCliente();
});
$('#btn-excluir').on('click',function(){
	if(inativo == 1){
		if (codigo == 0) {
			alert("Selecione um usuário para ser ativado!");
		}else{
			var retorno = confirm("Deseja realmente ativar este usuario?");
			if (retorno == true) {
				$.ajax({
				  method: "POST",
				  url: "banco.php",
				  data: {operacao : "7", id: codigo}
				}).done(function(data) {
					if (data == "erro") {
						alert("Ocorreu um erro ao tentar deletar!");
						return false;
					}else{
						document.location.reload(true);
					}
				});
				return false;			
			}
		}
	}else{
		if (codigo == 0) {
			alert("Selecione um usuário para ser desativado!");
		}else{
			var retorno = confirm("Deseja realmente desativar este usuário?");
			if (retorno == true) {
				$('#modal-exclusao').modal('show');
			}
		}
	}
});
$('#btn-alterar').on('click',function(){
	if (codigo !== 0) {
		$('#modal-alterar').modal('show');
	}else{
		alert('Nenhum usuário selecionado!');
	}	
});
$('#modal-insert').on('shown.bs.modal', function () {
	document.getElementById('inputNome').focus();
	document.getElementById('inputNome').value='';
	document.getElementById('inputEmail').value='';
	document.getElementById('inputTelefone').value='';
	document.getElementById('lista-grupo').value='0';
});
$('#modal-grupo').on('shown.bs.modal', function () {
	document.getElementById('inputDescricao').focus();
	document.getElementById('inputDescricao').value='';
});
$('#modal-detalhes').on('shown.bs.modal', function () {
	$.ajax({
	  method: "POST",
	  url: "banco.php",
	  data: {operacao : "8", id: codigo}
	}).done(function(data) {
		if (data == "erro") {
			alert("Ocorreu um erro ao tentar deletar!");
			return false;
		}else{
			var posicao = 0;
			var array_justificativa = data.split("|");
			for(;;){
				if (array_justificativa[posicao] == undefined) {
					break
				}else{
					document.getElementById('inputdetalhes').value = document.getElementById('inputdetalhes').value + array_justificativa[posicao];
					posicao = posicao + 1;
				}
			}			
		}
	});
	return false;		
});
$('#btn-detalhe').on('click',function(){
	if(codigo == 0){
		alert('Selecione um usuário para visualizar!');
	}else{
		document.getElementById('inputdetalhes').value = "";
		$('#modal-detalhes').modal('show');
	}
});
$('#modal-insert').on('hidden.bs.modal', function () {
	$('#inputTelefone').unmask();
});
$('#modal-alterar').on('hidden.bs.modal', function () {
	$('#inputTelefone2').unmask();
});
function MascaraTelefone(telefone){
	if (telefone == 1) {
		if ($('#inputTelefone').val().length == 11){
			$('#inputTelefone').mask('(00) 00000-0000');
		}if ($('#inputTelefone').val().length == 10){
			$('#inputTelefone').mask('(00) 0000-0000');
		}if ($('#inputTelefone').val().length <= 9){
			$('#inputTelefone').val("");
		}
	}else if (telefone == 2) {
		if ($('#inputTelefone2').val().length == 11){
			$('#inputTelefone2').mask('(00) 00000-0000');
		}if ($('#inputTelefone2').val().length == 10){
			$('#inputTelefone2').mask('(00) 0000-0000');
		}if ($('#inputTelefone2').val().length <= 9){
			$('#inputTelefone2').val("");
		}
	}
}
function ExcluiUsuario(){
	var desc = $('#inputJustificativa').val();
	if (desc == "") {
		alert("Informe uma justificativa!");
		return false;
	}else{
		$.ajax({
		  method: "POST",
		  url: "banco.php",
		  data: {operacao : "2", id: codigo, justif: desc}
		}).done(function(data) {
			if (data == "erro") {
				alert("Ocorreu um erro ao tentar deletar!");
				return false;
			}else{
				document.location.reload(true);
			}
		});
		return false;
	}
}
function AtualizaCliente(texto,tipo = 0){
	$.ajax({
	  method: "POST",
	  url: "banco.php",
	  data: {operacao : "1" ,pesquisa: texto, tp: tipo, inat: inativo}
	}).done(function(data) {
		if (data == "erro") {
			alert("Ocorreu um erro ao tentar listar os usuários!");
		}else{
			if(data != ""){
				var htmlLista = "";
				var posicao = 0;
				var array_usuarios = data.split("|");
				for(;;){
					if (array_usuarios[posicao+1] == undefined) {
						break
					}else{
						if (posicao == 0) {
							$('#row-table').append('<table class="table table-bordered" id="table-usuario"></table>');
							$('#table-usuario').append('<thead><tr><th>Codigo</th><th>Nome</th><th>Telefone</th><th>Email</th><th>Grupo</th></tr></thead>');
						}
					}
					htmlLista += '<tbody><tr><td>'+array_usuarios[posicao]+'</td><td>'+array_usuarios[posicao+1]+'</td><td>'+array_usuarios[posicao+2]+'</td><td>'+array_usuarios[posicao+3]+'</td><td>'+array_usuarios[posicao+4]+'</td></tr></tbody>';
					posicao = posicao + 5;					
				}
				$('#table-usuario').append(htmlLista);
			}
		}
	});
}
function ResetaTable(){
	var qtd_linhas = $("#table-usuario tr").length;
	if (qtd_linhas > 1){
		for(i = 1; i < qtd_linhas; i = i + 1){
			document.getElementById("table-usuario").deleteRow(1);
		}
		document.getElementById("table-usuario").deleteTHead();
		document.getElementById("table-usuario").remove();
	}
}
function Pesquisar(Reset){
	ResetaTable();
	if (Reset == 1){
		document.getElementById('txt-pesquisa').value = "";
		AtualizaCliente();
	}else{
		var pesquisa = document.getElementById('txt-pesquisa').value;
		if(isNaN(pesquisa) == true && pesquisa.indexOf("(") <= 0 && pesquisa.indexOf(")") <= 0 && pesquisa.indexOf("-") <= 0){
			AtualizaCliente(pesquisa,1);
		}else{
			AtualizaCliente(pesquisa,2);
		}
	}
}
function AtualizaGrupos(){
	$.ajax({
	  method: "POST",
	  url: "banco.php",
	  data: {operacao : "4"}
	}).done(function(data) {
		if (data == "erro") {
			alert("Ocorreu um erro ao tentar listar os grupos!");
		}else{
			var sel = document.getElementById('lista-grupo');
			for (i = sel.length - 1; i >= 0; i--) {
				sel.remove(i);
			}
			$('#lista-grupo').append('<option value="0">Selecione</option>');
			$('#lista-grupo2').append('<option value="0">Selecione</option>');
			$('#pesq-grupo').append('<option value="0">Selecione</option>');
			var posicao = 0;
			var array_grupo = data.split("|");
			for(;;){
				if (array_grupo[posicao+1] == undefined) {
					break
				}else{
					$('#lista-grupo').append('<option value="'+array_grupo[posicao]+'">'+array_grupo[posicao+1]+'</option>');
					$('#lista-grupo2').append('<option value="'+array_grupo[posicao]+'">'+array_grupo[posicao+1]+'</option>');
					$('#pesq-grupo').append('<option value="'+array_grupo[posicao+1]+'">'+array_grupo[posicao+1]+'</option>');
					posicao = posicao + 2;
				}
			}				
		}
	});	
}
function SelecionaG(control){
	ResetaTable();
    if(control.value != 0){
    	AtualizaCliente(control.value,3);
    }else{
    	AtualizaCliente();
    }
}
function IncluiUsuario(){
	var nome_insert     = $('#inputNome').val();
	var email_insert    = $('#inputEmail').val();
	var telefone_insert = $('#inputTelefone').val();
	var grupo_insert    = $('#lista-grupo option:selected').val();
	if (nome_insert == "" || nome_insert.length == 0) {
		alert("Nome não informado!");
		return false;
	}else if(email_insert == "" || email_insert.length == 0){
		alert("Email não informado!");
		return false;
	}else if(telefone_insert == "" || telefone_insert.length == 0){
		alert("Telefone não informado!");
		return false;
	}else if(grupo_insert == 0){
		alert("Nenhum grupo foi selecionado!");
		return false;
	}else{
		$.ajax({
		  method: "POST",
		  url: "banco.php",
		  data: {operacao : "3", nome: nome_insert, email: email_insert, telefone: telefone_insert, grupo: grupo_insert}
		}).done(function(data) {			
			if (data.indexOf('erro') >= 0) {
				alert("Ocorreu um erro ao tentar incluir um usuário!");
				return false;
			}else{
				alert("Usuário incluido!");
				document.location.reload(true);
				return true;
			}
		});
		return false;
	}	
}
function AlteraUsuario(){
	var nome_update     = $('#inputNome2').val();
	var email_update    = $('#inputEmail2').val();
	var telefone_update = $('#inputTelefone2').val();
	var grupo_update    = $('#lista-grupo2 option:selected').val();
	if (nome_update == "" || nome_update.length == 0) {
		alert("Nome não informado!");
		return false;
	}else if(email_update == "" || email_update.length == 0){
		alert("Email não informado!");
		return false;
	}else if(telefone_update == "" || telefone_update.length == 0){
		alert("Telefone não informado!");
		return false;	
	}else if(grupo_update == 0){
		alert("Nenhum grupo foi selecionado!");
		return false;
	}else{
		$.ajax({
		  method: "POST",
		  url: "banco.php",
		  data: {operacao : "5", id: codigo, nome: nome_update, email: email_update, telefone: telefone_update, grupo: grupo_update}
		}).done(function(data) {
			if (data == "erro") {
				alert("Ocorreu um erro ao tentar alterar um usuário!");
				return false;
			}else{
				alert("Usuário alterado!");
				document.location.reload(true);
				return true;
			}
		});
		return false;		
	}	
}
function InsereDescricao(){
	var descricao = $('#inputDescricao').val();
	if (descricao == "") {
		alert("Digite uma descricao valida!!");
		return false;
	}else{
		$.ajax({
		  method: "POST",
		  url: "banco.php",
		  data: {operacao : "6", desc: descricao}
		}).done(function(data) {
			if (data == "erro") {
				alert("Ocorreu um erro ao tentar incluir um novo grupo!");
				return false;
			}else{
				alert("Grupo criado!");
				AtualizaGrupos();
				$('#modal-grupo').modal('hide');
			}
		});		
	}
	return false;
}