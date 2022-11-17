$(document).ready(function(){
    /*$('#datas-container').html('<div class="text-center"><div class="spinner-grow" role="status"><span class="sr-only"></span></div></div>');
    $.get(window.apiUrl + 'dados/datas',{},(response) => {
        $('#datas-container').html('');
        $.each(response.dados,(index, dado)=>{
            $button = '<button class="btn btn-secondary mb-2" type="button" style="margin-right: 10px" data-bs-toggle="modal" data-bs-target="#exampleModal" data-data="' + dado.Dado.data + '" data-data-abrev="' + dado.Dado.data_str_abrev + '">' + dado.Dado.data_str_abrev + '</button>';
            $('#datas-container').append($button);
        })
    });*/
})

$('#exampleModal').on('shown.bs.modal', function (evt) {
    $('#exampleModal').find('.modal-body').html('<div class="text-center"><div class="spinner-grow" role="status"><span class="sr-only"></span></div></div>');
    const button = evt.relatedTarget;
    let data_selecionada = $(button).data('data');
    let data_abrev_selecionada = $(button).data('data-abrev');
    //console.log(data_selecionada);
    $('#exampleModal').find('.modal-title').html(data_abrev_selecionada);
    $.get( window.apiUrl + 'dados/dados/' + data_selecionada, {}, (response) => {
        $content_modal_body = $('<div></div>');
        $.each(response.dados, function(index, dado) {
            const fila_text = dado.fila_text;
            const filial_text = dado.filial_text;
            const status_text = dado.status_text;
            const json_fila = dado.json_text;
            let data = timeConverter(dado['Created Date']);

            $chamada_container = $('<div class="chamada_container"></div>');

            $chamada_container.append('<div class="row">'+
            '<div class="col-4">Data<br><strong>'+data+'</strong></div>'+
            '<div class="col-4">Filial<br><strong>'+filial_text+'</strong></div>'+
            '<div class="col-4">Fila<br><strong>'+fila_text+'</strong></div>'+
            '</div>');
            
            $chamada_container.append('<div class="row">'+
            '<div class="col-12 text-end mt-2"><button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#modal_fila" data-json-fila=' + "'" + JSON.stringify(json_fila) + "'" + '>Ver Fila</button></div>'+
            '</div>');

            $content_modal_body.append($chamada_container);
        })
        //console.log(JSON.stringify(response.dados));
        $('#exampleModal').find('.modal-body').html($content_modal_body);
    });
});

$('#modal_fila').on('shown.bs.modal', function (evt) {
    $('#modal_fila').find('tbody').html('<tr><td colspan="6"><div class="text-center"><div class="spinner-grow" role="status"><span class="sr-only"></span></div></div></td></tr>');
    const button = evt.relatedTarget;
    const json_fila = $(button).data('json-fila');
    //const fila_ordenada = ordena_fila(json_fila.fila.completa);
    const fila_ordenada_com_viagem = search_viagem(json_fila.fila.participantes, json_fila.viagens);
    console.log(fila_ordenada_com_viagem);

    $('#modal_fila').find('tbody').html('');
    $.each(fila_ordenada_com_viagem,(index, fila) => {

        $tr  = $('<tr></tr>');

        $td  = $('<td></td>');
        $td.addClass('text-center');
        $td.html((index+1));
        $tr.append($td);

        $td = $('<td></td>');
        $td.addClass('text-center');
        $td.html(fila.frota);
        $tr.append($td);

        $td  = $('<td></td>');
        $td.addClass('text-center');
        if ( fila.viagem && fila.viagem.ultimaCidade ) {
            $btn_viagem = $('<button class="btn btn-link" data-bs-toggle="modal" data-bs-target="#modal_carga" data-carga=' + "'" + JSON.stringify(fila.viagem.cargas) + "'" + '></button>');
            $btn_viagem.html(fila.viagem.ultimaCidade + '[' + fila.viagem.viagem_id + ']');
            $td.append($btn_viagem);
        } else {
            $td.html(fila.motivo);
        }
        $tr.append($td);

        $td = $('<td></td>');
        $td.addClass('text-center');
        if (fila.viagem && fila.viagem.entregas)
            $td.html(fila.viagem.entregas);
        $tr.append($td);


        $td = $('<td></td>');
        $td.addClass('text-center');
        if (fila.viagem && fila.viagem.entregas)
            $td.html((fila.viagem.valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
        $tr.append($td);

        $td = $('<td></td>');
        $td.addClass('text-center');
        if (fila.viagem && fila.viagem.entregas)
            $td.html(fila.viagem.veiculos);
        $tr.append($td);
    


        $('#modal_fila').find('tbody').append($tr);
    })
    


});

$('#modal_carga').on('shown.bs.modal', function (evt) {
    $('#modal_carga').find('tbody').html('<tr><td colspan="6"><div class="text-center"><div class="spinner-grow" role="status"><span class="sr-only"></span></div></div></td></tr>');
    const button = evt.relatedTarget;
    const json_carga = $(button).data('carga');

    $('#modal_carga').find('tbody').html('');
    $.each(json_carga,(index, carga) => {

        $tr  = $('<tr></tr>');

        $td  = $('<td></td>');
        //$td.addClass('text-center');
        $td.html(carga.modelo);
        $tr.append($td);

        $td = $('<td></td>');
        //$td.addClass('text-center');
        $td.html(carga.cor);
        $tr.append($td);

        $td  = $('<td></td>');
        //$td.addClass('text-center');
        $td.html(carga.dealer);
        $tr.append($td);

        $td  = $('<td></td>');
        //$td.addClass('text-center');
        $td.html(carga.km);
        $tr.append($td);

        $td  = $('<td></td>');
        //$td.addClass('text-center');
        $td.html(carga.destino);
        $tr.append($td);

        $td  = $('<td></td>');
        //$td.addClass('text-center');
        $td.html((carga.valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
        $tr.append($td);

        $('#modal_carga').find('tbody').append($tr);
    })
    


});

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = date + '/' + (a.getMonth()+1) + '/' + year;
    return time;
}

function ordena_fila(fila) {

    let fila_ordenada_arr = [];
    let arr_keys_ordem = {};

    arr_keys_ordem = Object.keys(fila).sort( function(keyA, keyB) {
        return fila[keyA].posicao - fila[keyB].posicao;
    });

    $.each(arr_keys_ordem,(index, item)=>{
        fila_ordenada_arr[index] = (Object.assign(fila[item], {frota: item}));
    });
    return fila_ordenada_arr;
}

function search_viagem(participantes, viagens) {
    let fila_ordenada_retornar = [];
    //$.each(fila_ordenada, (index,el) => {
     //   let participante = {}

        $.each(participantes, (index_part,part) => {
            //if ( part.frota == el.frota ) {
                if ( viagens[part.viagem] ) {
                    part.viagem = Object.assign(viagens[part.viagem], {viagem_id: part.viagem});
                }
                //participante = part;
                fila_ordenada_retornar.push(part);
            //}
        })

        //el.participante = participante;
        //fila_ordenada_retornar.push(el);

    //});

    return fila_ordenada_retornar;

}

