document.addEventListener('DOMContentLoaded', function(){

    // get var itemListRemember
    chrome.storage.sync.get(['ListRemember'], async function( result) {

        let  list = [];
        let objectList = {};
        let urlRegisteredExpired = true;

        try{
            //convert string JSON for array
            arrayList = JSON.parse(result.ListRemember); 
        }catch(e){
            arrayList = [];
        }
        console.log('aquiii');
        console.log(arrayList);

        //verify var list 
        if(typeof arrayList != 'undefined' && arrayList != [] ){
            list = arrayList;

            //verify var list is not array
            if( Array.isArray(list) ){
                
                //Create line in table 
                list.forEach(function(register, index){
                    // console.log(register);
                    // console.log(index);

                    //verificar se o registro possui url definida 
                    //caso não tenha iremos excluir este registro

                    if(typeof register.url != "undefined" && 
                        (
                            (typeof register.url == 'string' && register.url != '') ||
                            (typeof register.url == 'object' && Object.keys(register.url).length < 0 )
                        )
                    ){

                        let rowTable = document.createElement("tr");
                    
                        let tdTableUm = document.createElement("td");
                        let icon = '';
                        let url = register.url;

                        //verify icon youtube our site
                        if(url.indexOf("https://www.youtube.com/watch?") != -1 ){
                            
                            icon = document.createElement("iframe");
                            icon.setAttribute("id", "iFrameYoutube");
                            icon.setAttribute("width", "250");
                            icon.setAttribute("height", "150");

                            if(typeof register.icon != 'undefined'){
                                
                                //verificando se url tem que ser convertida ou não para mostrar iframe
                                if( register.icon.indexOf('embed') != -1){
                                    icon.setAttribute("src", register.icon);
                                }else{
                                    //caso não existir icon pegar url do usuario
                                    icon.setAttribute("src", converterURLformatFrameYoutube(register.url) );
                                }

                            }else{
                                //caso não existir icon pegar url do usuario
                                icon.setAttribute("src", converterURLformatFrameYoutube(register.url) );
                            }    

                            icon.setAttribute("frameborder", "0");
                            icon.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
                            icon.setAttribute('allowFullScreen', '');
                        }else{
                            //icon site
                            icon = document.createElement("img");
                            icon.setAttribute("id", "icon-website");
                            // icon.setAttribute("width", "250");
                            
                            icon.setAttribute("width", "200");
                            icon.setAttribute("height", "150");
                            icon.classList.add("offset-1");
    
                            if(typeof register.icon != "undefined"){
                                icon.setAttribute("src", register.icon);
                            }else{
                                //caminho default caso site não tenha icone
                                icon.setAttribute("src", 'img/favicon.png');
                            }
                            icon.setAttribute("alt", "icon the website");
                        }

                        tdTableUm.appendChild(icon);


                        //TD Dois description
                        let tdTableDois = document.createElement("td");
                        let description = document.createElement("div");
    
                        let p1 = document.createElement("p");
                        p1.innerText = "nome da url: " + register.url;
    
                        let p2 = document.createElement("p");
                        p2.innerText = "titulo da pagina: " + register.title;
    
                        let p3 = document.createElement("p");
                        p3.innerText = "data do cadastro: "+ convertTimestamp(register.date_at);
    
                        let p4 = document.createElement("p");
                        p4.innerText = "data de expiração: "+ convertTimestamp(register.date_expired);
    
                        //adicionar os p a description
    
                        description.appendChild(p1);
                        description.appendChild(p2);
                        description.appendChild(p3);
                        description.appendChild(p4);

                        tdTableDois.appendChild(description);

                        
                        //TD table 3 - button 
                        let tdTableTres = document.createElement("td");
                        let spaceBtn = document.createElement("div");
                        
                        let btnDelete = document.createElement("button");
                        btnDelete.setAttribute("id", "btn-delete");
                        btnDelete.classList.add("btn", "btn-danger");
                        btnDelete.innerText = "Excluir";

                        spaceBtn.appendChild(btnDelete);
                        tdTableTres.appendChild(btnDelete);

                        //ligação final da row da tabela
                        rowTable.appendChild(tdTableUm);
                        rowTable.appendChild(tdTableDois);
                        rowTable.appendChild(tdTableTres);

                        

                        document.getElementById("myTableHistory").appendChild(rowTable);

                    }

                });
                
                //filtrando array para retirar registros que não possuem URL
                let listFilter = list.filter(function(reg){
                    return typeof reg.url != "undefined" && 
                    (
                        (typeof reg.url == 'string' && reg.url != '') ||
                        (typeof reg.url == 'object' && Object.keys(reg.url).length < 0 )
                    );
                });

                //convertendo array for JSON
                listFilter = JSON.stringify(listFilter);

                //salvar alterações
                chrome.storage.sync.set({ListRemember: listFilter}, function() {
                    //salvo alterações
                });

            }else{
                list = [];
            }

        }else{
            list = []; //creat array global
        }

    });

    function convertTimestamp(timestamp){
        let data = new Date(timestamp);
        let hora = data.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

        return data.toLocaleDateString() + " " + hora; 
    }

    function converterURLformatFrameYoutube(url){
        //convertendo url para video_id, para usar thumb iframe

        //get video_id of the url 
        var video_id = url.split('v=')[1];

        //filtro para pegar apenas o id do video
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        
        // verifica se programa conseguiu pegar o video_id
        if(typeof video_id != 'undefined'){
            return "https://www.youtube.com/embed/"+ video_id;
        }else{
            //TODO:: retornar link default
            return '';
        }

    }
    

});

