function guardarCliente() {
    var nombre = $('#nombreCliente').val();
    var apellido = $('#apellidoCliente').val();
    var correo = $('#correoCliente').val();
    var contrasena = $('#contraseñaCliente').val();
    var provincia = $('#provincia').val();
    var canton = $('#canton').val();
    var direccionEx = $('#direccion').val();
    
    var req = $.ajax({
        url: '//wsrestaurante.azurewebsites.net/WSCliente.svc/registro?correo='+correo+'&nom='+nombre+'&ape='+apellido+'&provincia='+provincia+'&canton='+canton+'&direccionexacta='+direccionEx+'&contrasena='+contrasena,
        dataType: "jsonp",
        timeout:1500000
    });

    
    req.success(function(){
       $('#nombreCliente').val("");
       $('#apellidoCliente').val("");
       $('#correoCliente').val("");
       $('#contraseñaCliente').val("");
       $('#provincia').val("");
       $('#canton').val("");
       $('#direccion').val("");
    });
}
 
    
function procesarLogin(){
    alert("entro al login");
    var contrasena  = $("#txt-password").val();
    var correo = $("#txt-email").val();
    
    sessionStorage.setItem("correo", correo);
    sessionStorage.setItem("contrasena", contrasena);
    var correo = sessionStorage.getItem("correo");
    var contrasena = sessionStorage.getItem("contrasena");
    alert("get session_ " + correo + contrasena);
    
    var req = $.ajax({
        url: '//wsrestaurante.azurewebsites.net/WSCliente.svc/loginCliente?correo='+correo+'&contraseña='+contrasena,
        dataType: "jsonp",
        timeout:10000
    });
    req.success(function(datos){
        
        
        if(datos.nombre !=null){
            sessionStorage.setItem("idUsuario",datos.idCliente);
            $('#mensajeLogin').html("Entro correctamente");
            document.location.href = "platos.html";
        }else{
            $('#mensajeLogin').html("Error al iniciar sesión");
        }
    })
}

function logginFace(){
    var direccionexacta = $("#direccionexacta").val();
    var canton  = $("#canton").val();
    var provincia = $("#provincia").val();
    var nombre = $("#nombreCliente").val();
    var ap = $("#apellidoCliente").val();
    var correo = $("#correo").val();
    var req = $.ajax({
        url:'http://wsrestaurante.azurewebsites.net/WSCliente.svc/loginFace?correo='+correo+'&nom='+nombre+'&ap='+ap+'&provincia='+provincia+'&canton='+canton+'&direccionexacta='+direccionexacta,
        dataType:"jsonp",
        timeout:150000
        });
        
    req.success(function(datos){
        
        if(datos.nombre !=null){
             sessionStorage.setItem("contraseña", "");
            sessionStorage.setItem("correo", correo);
            sessionStorage.setItem("idUsuario",datos.idCliente);
            $('#mensajeLogin').html("Entro correctamente");
            
            document.location.href = "platos.html";
        }else{
            $('#mensajeLogin').html("Error al iniciar sesión");
        }
        
    });
}

//Admnistracion de datos del cliente-->

//Me va a cargar los datos del cliente.
$(document).on('pagebeforeshow', '#infoCliente', function(){

     cargarDatos(); 
});
  

function cargarDatos() {
        var correo = sessionStorage.getItem("correo");
        var contrasena = sessionStorage.getItem("contrasena");
        alert("correo: " + correo + " , cont: " + contrasena)
      var req = $.ajax({
        url: '//wsrestaurante.azurewebsites.net/WSCliente.svc/loginCliente?correo='+ correo +'&contraseña='+ contrasena,
        dataType: "jsonp",
        timeout:15000
    });
     req.success(function(datos){
    
       $('#nombreCliente').val(datos.nombre);
       $('#apellidoCliente').val(datos.apellidos);
       $('#correoCliente').val(datos.correo);
       $('#contraseñaCliente').val(datos.contraseña);
       $('#provincia').val(datos.direccion.provincia);
       $('#canton').val(datos.direccion.canton);
       $('#direccion').val(datos.direccion.direccionExacta);
    });
}

function actualizarDatos() {
    var nombre = $('#nombreCliente').val();
    var apellido = $('#apellidoCliente').val();
    var correo = $('#correoCliente').val();
    var contrasena = $('#contraseñaCliente').val();
    var provincia = $('#provincia').val();
    var canton = $('#canton').val();
    var direccionEx = $('#direccion').val();
    
      var req = $.ajax({
        url: '//wsrestaurante.azurewebsites.net/WSCliente.svc/modificarDatosCliente?idCli='+ 1 +'&corrreo='+correo+'&nom='+nombre+'&ape='+apellido+'&cont='+contrasena+'&idDir='+ 1+'&provincia='+provincia+'&canton='+canton+'&dirExacta='+direccionEx,
        dataType: "jsonp",
        timeout:15000
    });
     req.success(function(datos){ });
}


