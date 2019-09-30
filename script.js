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

    // CRUD in save information
    // create
    // read 
    // 
    // detele

    function verifyRegister(){
        //verificar se url já esta cadastrada 
        //verificar prazo de expiração
            //caso tiver dentro do prazo bloquear cadastro 
            //caso estiver fora do prazo deixar realizar o cadastro
    }

    async function CadastrarLembrete(){
        // get var itemListRemember

        chrome.storage.sync.get(['ListRemember'], async function( result) {

            let  list = [];
            let objectList = {};

            try{
                //convert string JSON for array
                arrayList = JSON.parse(result.ListRemember); 
            }catch(e){
                arrayList = [];
            }
            
            if(typeof arrayList != 'undefined' && arrayList != [] ){
                list = arrayList;

                //verify is not array
                if( !Array.isArray(list) ){
                    list = [];
                }

                objectList = await criarLembrete();

                //adicionar dentro do array
                list.push(objectList);

            }else{
                //creat array global
                list = [];

                objectList = await criarLembrete();

                //adicionar dentro do array
                list.push(objectList);

            }

            //convertendo array for JSON
            list = JSON.stringify(list);

            //salvar alterações
            chrome.storage.sync.set({ListRemember: list}, function() {
                alert('Alterações foram realizadas com sucesso!');
                console.log(list);
            });

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