console.log('Good to go!');

//Utitily Functions 

//1.  Get DOM element from a string
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

// Hide the parameteres box and json box initialy
let parametersBox = document.getElementById('parametersBox');
let jsonBox = document.getElementById('jsonBox');
parametersBox.style.display = 'none';
jsonBox.style.display = 'none';

// Initialy contentType field set is hidden,bcz request type is GET
document.getElementById("contentTypeFieldset").style.display='none';

let getRadio = document.getElementById('get');
let postRadio = document.getElementById('post');

// if request type is get hide content type fieldset as well as request content boxes
getRadio.addEventListener('click',()=>{
    document.getElementById("contentTypeFieldset").style.display='none';
    jsonBox.style.display='none';
    parametersBox.style.display='none';
})
// if request type is post show content type fieldset as well as request content boxes accordingly
postRadio.addEventListener('click',()=>{
    document.getElementById("contentTypeFieldset").style.display='block';
    
    let contentType = document.querySelector("input[name='contentType']:checked").value;
    if(contentType == "params"){
        parametersBox.style.display='block';
    }
    else{
        jsonBox.style.display='block';
    }
})

// If the user click on custom params, hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('jsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
})

// If the user click on json, hide the custom params
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('jsonBox').style.display = 'block';
    document.getElementById('parametersBox').style.display = 'none';
})

//Initialize params count
let addedParamsCount = 1

// If the user clicks on + button more params can be added
let addParam = document.getElementById('addParam');
addParam.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = `<div class="form-row my-2">
                        <label for="urlField" class="col-sm-2 col-form-label">Parameter - ${addedParamsCount + 1}</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="parameterKey${addedParamsCount + 1}" placeholder="Enter Param-${addedParamsCount + 1} Key">
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="parameterValue${addedParamsCount + 1}" placeholder="Enter Param-${addedParamsCount + 1} Value">
                        </div>
                        <button  class="btn btn-primary deleteParam"> - </button>
                    </div>`;
    // convert the element string to DOM element
    let paramElement = getElementFromString(string);
    //insert in DOM
    params.appendChild(paramElement);


    // Add an event listener to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName('deleteParam');

    for (item of deleteParam) {
        item.addEventListener('click', (e) => {
            // console.log(e.target);
            // console.log(e.target.parentElement);
            e.target.parentElement.remove();

        })
    }


    addedParamsCount++;
})

// If the user click on submit button
let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    // Show please wait in the response box to request the user to keep patience
    // document.getElementById('responseJsonText').value = 'Please wait...Fetching response...';
    document.getElementById('responsePrism').innerHTML = 'Please wait...Fetching response...';

    // Fetch all the values user has given
    let url = document.getElementById('urlField').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;
    
    // If user has used params option instead of json,collect all the parameters in a object
    if (contentType == 'params') {
        
        data = {};
        for (let i = 0; i < addedParamsCount; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
                
            }
            
        }
        data = JSON.stringify(data);
    }
    else{
        data = document.getElementById('requestJsonText').value;
    }
    
    //Log all the values in console for debugging
    console.log('URL is', url);
    console.log('request type is', requestType);
    console.log('content type is', contentType);
    console.log('data is', data);

    //If the requestType is  GET,invoke fetch API to create a GET request
    if(requestType == "GET"){
        fetch(url,{
            method : 'GET'
        })
        .then(response => response.text())
        .then((text) => {
            // document.getElementById('responseJsonText').value = text;
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    }
    else{
        fetch(url,{
            method : 'POST',
            body : data,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },

        })
        .then(response => response.text())
        .then((text) => {
            // document.getElementById('responseJsonText').value = text;
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    }
    
})



