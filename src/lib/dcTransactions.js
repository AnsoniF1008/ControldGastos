// Funciones del conector para la entidad Transaction (movimientos con fecha).
// Se mantienen aparte del SDK generado en ./dataconnect para no editar archivos
// autogenerados: reutilizan el mismo connectorConfig y replican el patrón que
// produce `firebase dataconnect:sdk:generate` (mutationRef + executeMutation).
// Si en el futuro se regenera el SDK, estas operaciones aparecerán allí y este
// módulo puede eliminarse sin cambiar dcApi.js (mismos nombres exportados).

import { mutationRef, executeMutation, validateArgs } from "firebase/data-connect";
import { connectorConfig } from "./dataconnect/esm/index.esm.js";

function makeMutation(operationName) {
  const fn = (dcOrVars, vars) => {
    const { dc: dcInstance, vars: inputVars } = validateArgs(
      connectorConfig,
      dcOrVars,
      vars,
      true
    );
    dcInstance._useGeneratedSdk();
    return executeMutation(mutationRef(dcInstance, operationName, inputVars));
  };
  fn.operationName = operationName;
  return fn;
}

export const insertTransaction = makeMutation("InsertTransaction");
export const updateTransaction = makeMutation("UpdateTransaction");
export const deleteTransaction = makeMutation("DeleteTransaction");
