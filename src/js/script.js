document.addEventListener('DOMContentLoaded', function(){

    chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        let isSite = false;

        // verifica se o usuario esta no youtube
        if(tablink.indexOf("https://www.youtube.com/watch?") != -1 ){

            //get video_id of the url 
            var video_id = tablink.split('v=')[1];

            //filtro para pegar apenas o id do video
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            
            // verifica se programa conseguiu pegar o video_id
            if(typeof video_id != 'undefined'){
                let iFrameYoutube = document.getElementById('iFrameYoutube');
                iFrameYoutube.setAttribute("src", "https://www.youtube.com/embed/"+ video_id );
                iFrameYoutube.removeAttribute("hidden");
                document.getElementById('definition-way').innerText = 'vídeo';
                document.getElementById('definition_btn_save').innerText = 'vídeo';
            }else{
                isSite = true;
            }
    
        }else{
            isSite = true;
        }

        //verify is a site
        if(isSite){
            document.getElementById('definition-way').innerText = 'site';
            document.getElementById('definition_btn_save').innerText = 'site';
            
            //add icon in site
            let iconSite = document.getElementById('icon-website');
            iconSite.setAttribute("src", tab.favIconUrl );
            iconSite.removeAttribute("hidden");

            let inputURL = document.getElementById('url-site');
            inputURL.value = tablink; //adicionando a url em um campo input
            inputURL.disabled = true;
            inputURL.removeAttribute("hidden");
        }

    });


    document.getElementById('btn_save_option').onclick = function(){ CadastrarLembrete()};

    document.getElementById('btn_history').onclick = function(){ window.location.href = 'history.html'; };

    async function CadastrarLembrete(){
        // get var itemListRemember
        chrome.storage.sync.get(['ListRemember'], async function( result) {

            let  list = [];
            let objectList = {};
            let registrationAccepted = true;

            try{
                //convert string JSON for array
                arrayList = JSON.parse(result.ListRemember); 
            }catch(e){
                arrayList = [];
            }
            console.log("------ARRAY-------");
            console.log(arrayList);

            //verify var list 
            if(typeof arrayList != 'undefined' && arrayList != [] ){
                list = arrayList;

                //verify var list is not array
                if( Array.isArray(list) ){
                    //verify if new register exist in list save in system and if existe verify date_expired 
                    //if date_expired invalid is create new register in system
                    
                    //get new url 
                    let registerNewUrl = '';
                    registerNewUrl = await getURL();

                    console.log("------GET URL-------");
                    console.log(registerNewUrl);

                    list.forEach(function(register){

                        //verify register equals 
                        if( typeof register.url != 'undefined' &&  typeof registerNewUrl != 'undefined' &&  register.url == registerNewUrl){

                            //verify date expired in register
                            if( typeof register.date_expired != 'undefined' && new Date( register.date_expired ) >= new Date() ){
                                registrationAccepted = false;
                            }
                            
                        }
                    },registrationAccepted);


                }else{
                    list = [];
                }

            }else{
                list = []; //creat array global
            }


            if(registrationAccepted){
                objectList = await criarLembrete();

                console.log("------OBJECT CREATE-------");
                console.log(objectList);

                //adicionar dentro do array
                list.push(objectList);
    
    
                //convertendo array for JSON
                list = JSON.stringify(list);
    
                //salvar alterações
                chrome.storage.sync.set({ListRemember: list}, function() {
                    document.getElementById('alert_success_register').classList.remove("d-none");
                });

            }else{
                //return mensagem if url be save in system
                document.getElementById('alert_register_exist').classList.remove("d-none");
            }


        });
        
    }

    async function criarLembrete(){
        // let varURL = '';
        // let varDateAt = '';
        // let expiredTime = '';

        let objectList = {};

        //get url 
        let varURL = await getURL();

        // get date_at && hour_at 
        let varDateAt = getDate();

        let expiredTime = getDateExpired(varDateAt);

        let varIcon = await getIcon();

        let varTitle = await getTitle();

        objectList = createObjectList(varURL, varDateAt, expiredTime, varIcon, varTitle);

        return objectList;
    }

    function createObjectList(varURL, varDateAt, expiredTime, varIcon, varTitle){
        let objectList = {
            url: varURL,
            date_at: varDateAt,
            date_expired: expiredTime,
            icon: varIcon,
            title: varTitle
        }
        return objectList;
    }



    async function getURL(){
        //get url in video
        return varURL = await new Promise((resolve, reject) => {
            chrome.tabs.getSelected(null,function(tab) {
                if(typeof tab != 'undefined'){
                    resolve(tab.url);
                }else{
                    reject('Faild not url found');
                }
                
            });
        }).then( async (result) => { 
            return result;
        }).catch( (menssage) => {
            console.log(menssage);
        });
    }

    async function getIcon(){
        //get url in video
        return varURL = await new Promise((resolve, reject) => {
            chrome.tabs.getSelected(null,function(tab) {
                if(typeof tab != 'undefined'){

                    //verificar se é youtube ou site
                    let result = null;
                    let tablink = tab.url;
                    //verificando se usuario esta assistindo youtube
                    if(tablink.indexOf("https://www.youtube.com/watch?") != -1 ){
                        result = tab.url;
                    }else{
                        //constatando que usuario esta em um site

                        //verificar se no site existe favIcon
                        if(typeof tab.favIconUrl != 'undefined'){
                            result = tab.favIconUrl;
                        }else{
                            //vamos ter que ter uma imagem default para sites que não possuim icon 
                            result = "default";
                        }
                    }

                    resolve(result);
                }else{
                    reject('Faild not url found');
                }
                
            });
        }).then( async (result) => { 
            return result;
        }).catch( (menssage) => {
            console.log(menssage);
        });
    }

    async function getTitle(){
        //get url in video
        return varURL = await new Promise((resolve, reject) => {
            chrome.tabs.getSelected(null,function(tab) {
                if(typeof tab != 'undefined'){
                    resolve(tab.title);
                }else{
                    reject('Faild not url found');
                }
                
            });
        }).then( async (result) => { 
            return result;
        }).catch( (menssage) => {
            console.log(menssage);
        });
    }



    function getDate(){
        return new Date().getTime();
    }

    function getDateExpired(varDateAt){
        let data = new Date( varDateAt ); //set timestamp for data
        let expiredTime = new Date(); //creat object data
        expiredTime.setDate(data.getDate() + 30);
        expiredTime = expiredTime.getTime(); //convert in timestamp
        return expiredTime;
    }

    function saveSiteOurVideo(){
        let valueLine = document.getElementById('lineText').value;

    }

});