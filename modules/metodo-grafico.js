function agregarRestriccion(){
    const contenedor = document.getElementById("restricciones");
    const restriccion = document.createElement("div");

    restriccion.className = "restriction";
    restriccion.innerHTML = `

        <input
            type="number"
            class="a1"
            value="1"
        >

        <span>X₁ +</span>

        <input
            type="number"
            class="a2"
            value="1"
        >

        <span>X₂</span>

        <select class="signo">

            <option value="<=">
                ≤
            </option>

            <option value=">=">
                ≥
            </option>

            <option value="=">
                =
            </option>

        </select>

        <input
            type="number"
            class="b"
            value="10"
        >

        <button
            class="delete"
            onclick="eliminarRestriccion(this)"
        >
            ×
        </button>

    `;
    contenedor.appendChild(restriccion);
}

function eliminarRestriccion(boton){
    const restricciones = document.querySelectorAll(".restriction");
    if(restricciones,length <= 1){
        alert("Debe exixter al menos una restricción");
        return;
    }

    boton.parentElement.remove();
}

function obtenerRestricciones(){
    const elementos = document.querySelectorAll(".restriction");
    const restricciones = [];

    elementos.forEach(elemento =>{
        const a1 = Number(elemento.querySelector(".a1").value);
        const a2 = Number(elemento.querySelector(".a2").value);
        const signo = elemento.querySelector(".signo").value;
        const b = Number(elemento.querySelector(".b").value);

        restricciones.push({
            a1: a1,
            a2, a2,
            signo: signo,
            b: b
        });
    });
    return restricciones;
}

function interseccion(r1, r2){
    const determinante = r1.a1 * r2.a2 - r2.a1 * r1.a2;
    if (determinante === 0){
        return null;
    }
    const x = ( r1.b * r2.a2 - r2.b * r1.a2)/determinante;
    const y = (r1.a1 * r2.b - r2.b * r1.a2)/determinante;

    return{
        x:x,
        y:y
    };
}

function cumpleRestriccion(punto, restriccion){
    const resultado = restriccion.a1 * punto.x + restriccion.a2 * punto.y;
    const tolerancia = 0.000001;

    if(restriccion.signo === "<="){
        return resultado <= restriccion.b + tolerancia;
    }
    if(restriccion.signo === ">="){
        return resultado >= restriccion.b - tolerancia;
    }
    return Math.abs(resultado - restriccion.b)<=tolerancia;
}

function puntoValido(punto, restricciones){
    if(punto.x < -0.000001){
        return false;
    }
    if(punto.y < -0.000001){
        return false;
    }

    return restricciones.every(
        r => cumpleRestriccion(punto, r)
    );
}

function resolverMetodoGrafico(){
    const c1 = Number(document.getElementById("c1"). value);
    const c2 = Number(document.getElementById("c2").value);
    const tipo = document.getElementById("tipoObjetivo").value;
    const restricciones = obtenerRestricciones();
    const puntos = [];

    puntos.push({
        x:0,
        y:0
    });

    restricciones.forEach(r => {
        if(r.a1 !== 0){
            puntos.push({
                x: r.b / r.a1,
                y:0
            });
        }
        if(r.a2 !== 0){
            puntos.push({
                x:0,
                y:r.b / r.a2
            });
        }
    });

    for(
        let i = 0;
        i < restricciones.length;
        i++
    ){
        for(
            let j = i + 1;
            j < restricciones.length;
            j++
        ){
            const punto = interseccion(restricciones[i], restricciones[j]);
             
            if(punto !== null) {
                puntos.push(punto);
            }
        }
    }

    //Eliminar puntos repetidos
    const puntosUnicos = [];
    puntos.forEach(punto => {
        const existe = puntosUnicos.some( p=> 
            Math.abs(p.x - punto.x) < 0.000001 &&
            Math.abs(p.y - punto.y) < 0.000001
        );

        if(!existe){
            puntosUnicos.push(punto);
        }
    });

    //Filtrar Región factible
    const factibles = puntosUnicos.filter(punto =>
        puntoValido(
            punto,
            restricciones
        )
    );

    if(factibles.length === 0){
        mostrarResultados("No existe una región factible con las restricciones proporcionadas.");
        return;
    }

    //Evaluar puntos 
    const evaluados = factibles.map(punto => ({
        x: punto.x,
        y: punto.y,
        z: evaluarObejetivo(
            punto,
            c1,
            c2
        )
    }));

    //Encontrar óptimo
    let optimo = evaluados[0];
    evaluados.forEach(punto => {
        if(tipo === "max"){
            if(punto.z > optimo.z){
                optimo = punto;
            }
        }else{
            if(punto.z < optimo.z) {
                optimo = punto;
            }
        }
    });

    mostrarResultados(crearResultadoHTML(
        evaluados,
        optimo,
        tipo,
        c1,
        c2,
        restricciones
    ));
}

function crearResultadoHTML(
    puntos,
    optimo,
    tipo,
    c1,
    c2,
    restricciones
){
    let html = 
    `<h2>Resultado</h2>

        <p>
            Se analizaron los puntos de la
            región factible.
        </p>

        <h3>Vértices factibles</h3>

        <table>

            <tr>
                <th>Punto</th>
                <th>X₁</th>
                <th>X₂</th>
                <th>Z</th>
            </tr>

    `;
    puntos.forEach((punto, index) => {
        html += 
        `
            <tr>

                <td>P${index + 1}</td>

                <td>${punto.x.toFixed(2)}</td>

                <td>${punto.y.toFixed(2)}</td>

                <td>${punto.z.toFixed(2)}</td>

            </tr>
        `;
    });

    html += `
        </table>

        <div class="optimal">

            <h3>
                Solución óptima
            </h3>

            <p>
                X₁ =
                <strong>
                    ${optimo.x.toFixed(2)}
                </strong>
            </p>

            <p>
                X₂ =
                <strong>
                    ${optimo.y.toFixed(2)}
                </strong>
            </p>

            <p>
                ${
                    tipo === "max"
                        ? "Valor máximo"
                        : "Valor mínimo"
                }
                de Z =
                <strong>
                    ${optimo.z.toFixed(2)}
                </strong>
            </p>

        </div>
    `;
    return html;
}

function mostrarResultados(contenido) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = contenido;
}