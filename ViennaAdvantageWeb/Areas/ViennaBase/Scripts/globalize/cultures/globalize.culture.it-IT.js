/*
 * Globalize Culture it-IT
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function (window, undefined) {

    var Globalize;

    if (typeof require !== "undefined" &&
        typeof exports !== "undefined" &&
        typeof module !== "undefined") {
        // Assume CommonJS
        Globalize = require("globalize");
    } else {
        // Global variable
        Globalize = window.Globalize;
    }

    Globalize.addCultureInfo("it-IT", "default", {
        name: "it-IT",
        englishName: "Italian (Italy)",
        nativeName: "italiano (Italia)",
        language: "it",
        numberFormat: {
            ",": ".",
            ".": ",",
            "NaN": "Non un numero reale",
            negativeInfinity: "-Infinito",
            positiveInfinity: "+Infinito",
            percent: {
                pattern: ["-n%", "n%"],
                ",": ".",
                ".": ","
            },
            currency: {
                pattern: ["-$ n", "$ n"],
                ",": ".",
                ".": ",",
                symbol: "€"
            }
        },
        calendars: {
            standard: {
                firstDay: 1,
                days: {
                    names: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
                    namesAbbr: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
                    namesShort: ["do", "lu", "ma", "me", "gi", "ve", "sa"]
                },
                months: {
                    names: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre", ""],
                    namesAbbr: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic", ""]
                },
                AM: null,
                PM: null,
                eras: [{ "name": "d.C.", "start": null, "offset": 0 }],
                patterns: {
                    d: "dd/MM/yyyy",
                    D: "dddd d MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dddd d MMMM yyyy HH:mm",
                    F: "dddd d MMMM yyyy HH:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM yyyy"
                }
            }
        },
        messages: {
            "Connection": "Connessione",
            "Defaults": "Defaults", //Need to be checked
            "Login": "login",
            "File": "File",
            "Exit": "Esci",
            "Help": "Aiuto",
            "About": "Informazioni",
            "Host": "Host",
            "Database": "Database",
            "User": "Identificativo Utente",
            "EnterUser": "Identificativo Utente Applicazione",
            "Password": "Password",
            "EnterPassword": "Inserimento password Applicazione",
            "Language": "Linguaggio",
            "SelectLanguage": "Selezionate il vostro linguaggio",
            "Role": "Ruolo",
            "Client": "Mandante",
            "Organization": "Organizzazione",
            "Date": "Data",
            "Warehouse": "Magazzino",
            "Printer": "Stampante",
            "Connected": "Connesso",
            "NotConnected": "Non Connesso",
            "DatabaseNotFound": "Database non trovato",
            "UserPwdError": "L'Utente non corrisponde alla password",
            "RoleNotFound": "Ruolo non trovato",
            "Authorized": "Authorizzato",
            "Ok": "Ok",
            "Cancel": "Cancella",
            "VersionConflict": "Conflitto di Versione:",
            "VersionInfo": "Server <> Client",
            "PleaseUpgrade": "Prego lanciare il programma di update",
            "Back": "indietro",
            "SelectRole": "Selezionare Ruolo",
            "SelectOrg": "Selezionare Organizzazione",
            "SelectClient": "Selezionare Client",
            "SelectWarehouse": "Selezionare Magazzino",
            "VerifyUserLanguage": "Verificare Lingua utente",
            "LoadingPreference": "Caricamento di preferenza",
            "Completed": "completato",


            //New Resource

            "SelectDate": "Selezionare Data",

            //new
            "RememberMe": "Ricordati Di Me",
            "FillMandatoryFields": "Fill Mandatory Fields",
        }
    });

}(this));
