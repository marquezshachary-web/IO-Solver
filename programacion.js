function irAMdodulos(){
    document
    .getElementById("modulos")
    .scrollIntoView({
        behavior:"smooth"
    });
}

function abrirModulo(modulo){
    if(modulo==="programacion-lineal"){
        alert(
           "Módulo de Programación Lineal\n\n"+
           "Aquí construiremos: \n"+
           "• Formulación de modelos\n"+
           "• Método gráfico \n"+
           "• Método Simplex \n"+
           "• Aplicaciones"
        );
    }
}