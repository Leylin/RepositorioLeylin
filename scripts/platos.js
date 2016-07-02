  $(document).on('pagebeforeshow', '#platos', function(){
     cargarPlatos(); 
  });


function cargarPlatos(){
    var req = $.ajax({
       url:'//wsrestaurante.azurewebsites.net/WSPlato.svc/obtenerPlatosDisponibles',
       dataType: "jsonp",
       timeout: 10000
    });
    
    req.success(function(datos){
       procesarPlatos(datos); 
    });
}

function procesarPlatos(datos){
    $('#lista_platos').empty();
    
    $.each(datos,function(){
    var listaplatos = document.getElementById('lista_platos');
    
    var li = document.createElement('li');
    
    var a = document.createElement('a');
    a.innerHTML = this.nombre;
    a.href = '#platoDetalle';
    li.appendChild(a);
    

    //ESTO ES PRUEBA, NO BORRAR
    //var img = document.createElement("img");
    //img.src="http://apprestaurante.azurewebsites.net/" + this.fotografia;
    //li.appendChild(img);
    
    //var nombre= document.createElement('h2');
    //nombre.innerHTML = this.nombre;
    //li.appendChild(nombre);
    
    var precio = document.createElement('p');
    precio.innerHTML = "Precio: " + this.precio;
    li.appendChild(precio);
    
    li.setAttribute("id", this.idPlato);
    li.setAttribute("onclick", "cargarPlatoCompleto(" + this.idPlato + ")");
    listaplatos.appendChild(li);
    });
    
    $("#lista_platos").listview('refresh');
}

function cargarPlatoCompleto(idPlato) {
  var req = $.ajax({
     url: '//wsrestaurante.azurewebsites.net/WSPlato.svc/obtenerPlatosDisponibles',
     dataType: "jsonp",
     timeout: 10000
  });

  req.success(function (datos) {
  platoDetalle(datos, idPlato);

  });
}

function realizaCompra(){
var count =0;
var fechaActual = new Date();
var dd = fechaActual.getDate();
var mm = fechaActual.getMonth()+1;
var yyyy = fechaActual.getFullYear();
var hora = fechaActual.getHours();
var minutos = fechaActual.getMinutes();
var segundo = fechaActual.getSeconds();
if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

if(hora<10){
    hora='0'+hora;
}

if(minutos<10){
    minutos = '0'+minutos;
}

if(segundo<10){
    segundo='0'+segundo;
}

fechaActual = mm+'/'+dd+'/'+yyyy+' '+hora+':'+minutos+':'+segundo;
var idClient= sessionStorage.getItem("idUsuario") ;
 var array = new Array(sessionStorage.length-3);
 var ids="";
 for(i=0; i<=sessionStorage.length-4;i++){
     key = sessionStorage.key(i);
     cantidad = sessionStorage.getItem(key);
     while(cantidad != 0){
         ids = key+"%"+ids;
        cantidad--;
     }
     
    
    
 }
 insertarPedido(ids,idClient,fechaActual);
  for(i= sessionStorage.length-4;i >=0;i--){
        key = sessionStorage.key(i);
         sessionStorage.removeItem(key);
        
    }
 
     document.location.href = "#platos";
}

function insertarPedido(idplato, idCliente, fechaActual) {
    
    var req = $.ajax({
        url:'http://wsrestaurante.azurewebsites.net/WSCliente.svc/insertarOrdenPedido?idCliente='+idCliente+'&fecha='+fechaActual+'&idPlatos='+idplato,
        dataType:'jsonp',
        timeout:100000
    });
    req.success(function(datos) {
     
    });
}

function platoDetalle(datos, idPlato) {
    
    
    $.each(datos, function(){
        if(idPlato == this.idPlato){
            $("#idPlato").val(this.idPlato);
            
            $('#nombre').html(this.nombre);
    
            $('#descripcion').html("Descripcion: " + this.descripcion);
            
            $('#precio').html("Precio: " + this.precio);
            
            var img = document.getElementById("imagen");
            img.src="http://apprestaurante.azurewebsites.net/" + this.fotografia;
        }
    });
}

function refrescarLista(){
    
}

function agregarAlCarro(){
    var id = $("#idPlato").val();
    var cantidad = $("#cantidad").val();
    var pedido = [id,cantidad];
   sessionStorage.setItem($("#idPlato").val(),$("#cantidad").val());
}

function listarPlatosEnCarro(){
    $("#totalPedido").text(0);
    $("#listaPlatosAgregados").empty();
    for(i=0;i <= sessionStorage.length-1;i++){
        key = sessionStorage.key(i);
        item = sessionStorage.getItem(key);
         traerPlatos(key, item);
         
    }
   
}

function traerPlatos(key, item){
     var req = $.ajax({
     url: '//wsrestaurante.azurewebsites.net/WSPlato.svc/obtenerPlatosDisponibles',
     dataType: "jsonp",
     timeout: 10000
  });
  
   req.success(function (datos) {
    listarCarro(datos, key, item);

  });
}

function listarCarro(datos, key,item) {
    
    $.each(datos, function(){
        if(key == this.idPlato){
            var nuevoli = document.createElement("li");
            
            var precioLinea = item*this.precio;
            
            var precioTotal = parseInt($("#totalPedido").text());
            
            var aEliminar = document.createElement("a");
            var aEliminarIcono = document.createElement("a");
            aEliminarIcono.setAttribute("class","ui-alt-icon ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-right");
            aEliminarIcono.setAttribute("onclick","eliminar("+this.idPlato+")");
            aEliminar.innerHTML = "Plato: "+ this.nombre +"<br />Cantidad: "+item+"<br />Precio: "+precioLinea;
            precioTotal = precioTotal+ precioLinea;
            nuevoli.appendChild(aEliminar);
            nuevoli.appendChild(aEliminarIcono);
           
           $("#listaPlatosAgregados").append(nuevoli);
           $("#totalPedido").text( precioTotal);
        }
                 
         $("#listaPlatosAgregados").listview('refresh');
    });
}

function eliminar(idPlato){
    sessionStorage.removeItem(idPlato);
    listarPlatosEnCarro();
}
