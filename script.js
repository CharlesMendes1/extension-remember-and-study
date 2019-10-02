document.addEventListener('DOMContentLoaded', function(){

    chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;

        // verifica se o usuario esta no youtube
        if(tablink.indexOf("https://www.youtube.com/watch?") != -1 ){

            //pegando o video_id da url 
            var video_id = tablink.split('v=')[1];

            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            
            // verifica se programa conseguiu pegar o video_id
            if(typeof video_id != 'undefined'){
                let iFrameYoutube = document.getElementById('iFrameYoutube');
                iFrameYoutube.setAttribute("src", "https://www.youtube.com/embed/"+ video_id );
                iFrameYoutube.removeAttribute("hidden");
            }
    
        }

    });



    document.getElementById('btn_save_option').onclick = function(){ CadastrarLembrete()};


    document.getElementById('btn_history').onclick = function(){ window.location.href = '/history.html'; };

    // CRUD in save information
    // create
    // read 
    // 
    // detele


    async function CadastrarLembrete(){
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

            //verify var list 
            if(typeof arrayList != 'undefined' && arrayList != [] ){
                list = arrayList;

                //verify var list is not array
                if( Array.isArray(list) ){
                    //verify if new register exist in list save in system and if existe verify date_expired 
                    //if date_expired invalid is create new register in system
                    let registerNewUrl = '';
            
                    //get new url 
                    registerNewUrl = await getURL();

                    list.forEach(function(register){

                        //verify register equals 
                        if( typeof register.url != 'undefined' &&  typeof registerNewUrl != 'undefined' &&  register.url == registerNewUrl){

                            //verify date expired in register
                            if( typeof register.date_expired != 'undefined' && new Date( register.date_expired ) >= new Date() ){
                                urlRegisteredExpired = false;
                            }
                            
                        }
                    },urlRegisteredExpired);


                }else{
                    list = [];
                }

            }else{
                list = []; //creat array global
            }


            if(urlRegisteredExpired){
                objectList = await criarLembrete();

                //adicionar dentro do array
                list.push(objectList);
    
    
                //convertendo array for JSON
                list = JSON.stringify(list);
    
                //salvar alterações
                chrome.storage.sync.set({ListRemember: list}, function() {
                    alert('Alterações foram realizadas com sucesso!');
                });

            }else{
                //return mensagem if url be save in system
                document.getElementById('alert_register_exist').classList.remove("d-none");
            }


        });
        
    }

    async function criarLembrete(){
        let varURL = '';
        let varDateAt = '';
        let expiredTime = '';
        let objectList = {};

        //get url 
        varURL = await getURL();

        // get date_at && hour_at 
        varDateAt = getDate();

        expiredTime = getDateExpired(varDateAt);

        objectList = createObjectList(varURL, varDateAt, expiredTime);

        return objectList;
    }

    function createObjectList(varURL, varDateAt, expiredTime){
        let objectList = {
            url: varURL,
            date_at: varDateAt,
            date_expired: expiredTime
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