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
}