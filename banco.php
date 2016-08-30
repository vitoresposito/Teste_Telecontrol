<?php
	$conexao = pg_connect("host=localhost port=5432 dbname=avaliacao_teste user=avaliacao password=av6588");

	if (!$conexao) {
		echo "erro";
	}else{
		if (isset($_POST['operacao'])) {			
			if($_POST['operacao'] == "1"){ //Lista todos os clientes
				if (isset($_POST['pesquisa'])) {
					if ($_POST['tp'] == "1"){
						$where = " WHERE lower(nome) LIKE '%".strtolower($_POST['pesquisa'])."%'";
					}elseif ($_POST['tp'] == "2") {
						$telefone = $_POST['pesquisa'];

						if (strpos($telefone,"-") == false) {
							$posicao = strlen($telefone) - 4;
							$telefone = substr($telefone,0,$posicao)."-".substr($telefone,$posicao);
						}

						if (strlen($telefone) > 10 && strpos($telefone,"(") == false && strpos($telefone,")") == false) {
							$telefone = "(".substr($telefone,0,2).")".substr($telefone,2);
						}

						if(strrpos($telefone," ") == false){
							$telefone = substr($telefone,0,4)." ".substr($telefone,4);
						}						

						$where = " WHERE telefone LIKE '%".$telefone."%'";
					}else{
						$where = " WHERE lower(descricao) = '".strtolower($_POST['pesquisa'])."'";
					}
				}else{
					$where = "";
				}				

				$retorno = array();
				if (isset($_POST['inat']) && $_POST['inat'] == "1") {
					$Result = pg_query($conexao,"SELECT * FROM view_clientes_inativos ".$where." ORDER BY cliente;");
				}else{
					$Result = pg_query($conexao,"SELECT * FROM view_clientes_ativos ".$where." ORDER BY cliente;");
				}

				while ($row = pg_fetch_array($Result)) {
					array_push($retorno, $row['cliente']);					
					array_push($retorno, $row['nome']);
					array_push($retorno, $row['telefone']);
					array_push($retorno, $row['email']);
					array_push($retorno, $row['descricao']);
				}				
				echo implode("|",$retorno);
			}elseif ($_POST['operacao'] == "2"){//Desativa cliente
				pg_execute("Begin transaction;");
				$Result = pg_query($conexao,"INSERT INTO tbl_desativado(id_cliente,justificativa) VALUES (".$_POST['id'].",'".$_POST['justif']."')");
				if (!$Result) {
					echo "erro";
					pg_execute("rollback;");
				}else{
					$Result = pg_query($conexao,"UPDATE tbl_cliente set ativo = false WHERE cliente = ".$_POST['id'].";");
					if (!$Result) {
						echo "erro";
						pg_execute("rollback;");
					}else{
						pg_execute("commit;");
					}
				}
			}elseif ($_POST['operacao'] == "3") {//Insere novo cliente
				pg_execute("Begin transaction;");
				$Result = pg_query($conexao,"INSERT INTO tbl_cliente(nome,email,telefone,grupo) VALUES('".$_POST['nome']."','".$_POST['email']."','".$_POST['telefone']."',".$_POST['grupo'].");");
				if (!$Result) {
					pg_execute("rollback;");
					echo "erro";
				}else{
					pg_execute("commit;");
				}
			}elseif ($_POST['operacao'] == "4") {//Lista todos os grupos
				$retorno = array();
				$Result = pg_query($conexao,"SELECT grupo,descricao FROM tbl_grupo;");

				while ($row = pg_fetch_array($Result)) {
					array_push($retorno, $row['grupo']);
					array_push($retorno, $row['descricao']);
				}				
				echo implode("|",$retorno);
			}elseif ($_POST['operacao'] == "5") {//Altera o cliente
				$Result = pg_query($conexao,"UPDATE tbl_cliente SET nome ='".$_POST['nome']."',email ='".$_POST['email']."',telefone ='".$_POST['telefone']."',grupo =".$_POST['grupo']." WHERE cliente = ".$_POST['id'].";");
				if (!$Result) {
					echo "erro";
				}				
			}elseif ($_POST['operacao'] == "6") {//Insere um grupo
				$Result = pg_query($conexao,"INSERT INTO tbl_grupo(descricao) VALUES('".$_POST['desc']."');");
				if (!$Result) {
					echo "erro";
				}
			}elseif ($_POST['operacao'] == "7") {//Ativar usuario
				$Result = pg_query($conexao,"UPDATE tbl_cliente set ativo = true WHERE cliente = ".$_POST['id'].";");
				if (!$Result) {
					echo "erro";
				}
			}elseif ($_POST['operacao'] == "8") {
				$retorno = array();
				$Result = pg_query($conexao,"SELECT justificativa FROM tbl_desativado WHERE id_cliente = ".$_POST['id'].";");
				if (!$Result) {
					echo "erro";
				}else{
					while ($row = pg_fetch_array($Result)) {
						array_push($retorno, $row['justificativa']);
					}				
					echo implode("|",$retorno);					
				}
			}
		}		
		pg_close($conexao);
	}
?>