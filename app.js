/*
======================================================
CAUSA30
Archivo: app.js
Versión: 0.1.0
Arquitectura Vanilla JS
======================================================
*/

"use strict";

/*=====================================================
CONFIGURACIÓN
=====================================================*/

const APP = {

    name: "Causa30",

    version: "0.1.0",

    debug: true

};

/*=====================================================
ESTADO GLOBAL
=====================================================*/

const state = {

    currentScreen: "home",

    initialized: false,

    splashDuration: 1800,

    darkMode: false

};

/*=====================================================
SELECTORES
=====================================================*/

const UI = {

    splash: document.getElementById("splash"),

    app: document.getElementById("app"),

    startButton: document.getElementById("startButton"),

    bottomButtons: document.querySelectorAll(".bottom-nav button")

};

/*=====================================================
UTILIDADES
=====================================================*/

function log(message) {

    if (APP.debug) {

        console.log("[CAUSA30]", message);

    }

}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

/*=====================================================
SPLASH
=====================================================*/

async function showSplash() {

    if (!UI.splash) return;

    UI.splash.style.display = "flex";

    await sleep(state.splashDuration);

    UI.splash.classList.add("hide");

    await sleep(600);

    UI.splash.remove();

}

/*=====================================================
NAVEGACIÓN
=====================================================*/

function activateNavigation(button) {

    UI.bottomButtons.forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

}

function navigate(screen) {

    state.currentScreen = screen;

    log("Pantalla actual: " + screen);

    /*
        Aquí más adelante
        cargaremos cada pantalla.

        Inicio
        Explorar
        Publicar
        Favoritos
        Perfil
    */

}

/*=====================================================
EVENTOS
=====================================================*/

function registerEvents() {

    if (UI.startButton) {

        UI.startButton.addEventListener("click", () => {

            log("Botón comenzar");

            navigate("explorar");

        });

    }

    UI.bottomButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            activateNavigation(button);

            switch (index) {

                case 0:

                    navigate("home");

                    break;

                case 1:

                    navigate("explorar");

                    break;

                case 2:

                    navigate("publicar");

                    break;

                case 3:

                    navigate("favoritos");

                    break;

                case 4:

                    navigate("perfil");

                    break;

            }

        });

    });

}

/*=====================================================
PREFERENCIAS
=====================================================*/

function loadPreferences() {

    const dark = localStorage.getItem("causa30-dark");

    if (dark === "true") {

        state.darkMode = true;

        document.body.classList.add("dark");

    }

}

function savePreferences() {

    localStorage.setItem("causa30-dark", state.darkMode);

}

/*=====================================================
MODO OSCURO
=====================================================*/

function toggleDarkMode() {

    state.darkMode = !state.darkMode;

    document.body.classList.toggle("dark");

    savePreferences();

}

/*=====================================================
ANIMACIONES
=====================================================*/

function fadeIn(element) {

    if (!element) return;

    element.style.opacity = 0;

    requestAnimationFrame(() => {

        element.style.transition = "opacity .4s";

        element.style.opacity = 1;

    });

}

/*=====================================================
INICIALIZACIÓN
=====================================================*/

async function initialize() {

    log("Inicializando...");

    loadPreferences();

    registerEvents();

    fadeIn(UI.app);

    await showSplash();

    state.initialized = true;

    log("Aplicación lista");

}

/*=====================================================
DOM READY
=====================================================*/

document.addEventListener("DOMContentLoaded", initialize);

/*=====================================================
API PÚBLICA
=====================================================*/

window.Causa30 = {

    navigate,

    toggleDarkMode,

    state

};
