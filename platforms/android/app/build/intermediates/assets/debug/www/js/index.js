$(function(){
	loadNoticias();

	//$("#data-inicio").datepicker({ dateFormat: 'dd/mm/yy'});
	//$("#data-fim").datepicker({ dateFormat: 'dd/mm/yy'});

	$(".modal-dialog").on("click",function(e){
		console.log(e);
		e.preventDefault();
	});

	$("#btnPesquisar").on("click",function(){
		currentPage = 1;
		loadNoticias();
	});

});

var noticias;
var currentPage = 1;

function loadNoticias(){
	$("#modal").modal("show");
	let endPoint = "http://servicodados.ibge.gov.br/api/v3/noticias";

	let busca = $("#busca").val();
	let dataInicio = $("#data-inicio").val();
	let dataFim = $("#data-fim").val();

	let query = { tipo: "noticia", qtd: "10", page: currentPage };

	if(busca != "")
		query.busca = busca;
	if(dataInicio != "")
	{
		query.de = dataInicio;
	}
	if(dataFim != "")
	{
		query.ate = dataFim;
	}


	$.ajax({
		method:"get",
		data: query,
		url: endPoint,
		success: function(dados){
			console.log(dados);
			if(dados.count == 0){
				$("#news").html("<div class='text-center w-100 mt-5' ><span class='h4' >A pesquisa não retornou resultados</span></div>");
				$("#pagination-row").hide();
			}
			else{
				$("#pagination-row").show();
				noticias = dados.items;
				let conteudo = '';

				for(let i = 0; i < noticias.length; i++){
					var imagens = JSON.parse(noticias[i].imagens);

					conteudo += '<div class="col-12 col-md-6 col-lg-4 mt-4">'+
									'<div class="noticia">'+
										'<img src="https://www.ibge.gov.br/'+imagens.image_intro+'" class="noticia-img" >'+
										'<div class="mt-1 mb-1"><span class="h6 ">'+noticias[i].titulo+'</span></div>'+
										'<div><span>'+noticias[i].introducao+'</span></div>'+
									'</div>'+
								'</div>';
				}

				$("#news").html(conteudo);
				buildPagination(dados.totalPages);
			}
			$("#modal").modal("hide");

		},
		error: function(erro){
			$("#news").html("<span class='h4' >A pesquisa não retornou resultados</span>");
			$("#pagination-row").hide();
			$("#modal").modal("hide");
		}
	});
}


function buildPagination(totalPages){
	if(totalPages > 10) totalPages = 8;

	let pages = '';

	if(currentPage == 1)
		pages += '<li class="page-item disabled"><a class="page-link" href="#" onclick="previous()" > < </a></li>';
	else
		pages += '<li class="page-item"><a class="page-link" href="#" onclick="previous()" > < </a></li>';

	for(let i = 1; i <= totalPages; i++){
		if(i == currentPage)
			pages += '<li class="page-item active"><a class="page-link" href="#" onclick="clickPage('+i+')">'+i+'</a></li>';
		else
			pages += '<li class="page-item"><a class="page-link" href="#" onclick="clickPage('+i+')">'+i+'</a></li>';
	}

	if(currentPage == totalPages)
		pages += ' <li class="page-item disabled"><a class="page-link" href="#" onclick="next()" > > </a></li>';
	else
		pages += ' <li class="page-item"><a class="page-link" href="#" onclick="next()" > > </a></li>';

	$("#pagination").html(pages);

}

function clickPage(page){
	currentPage = page;
	loadNoticias();
}

function previous(){
	currentPage--;
	loadNoticias();
}

function next(){
	currentPage++;
	loadNoticias();
}