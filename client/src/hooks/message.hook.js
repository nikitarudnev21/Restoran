import { useCallback } from "react";
// показываем сплывающие окно из библиотеки materialize
export const useMessage = () => {
    return useCallback(
        text => {
            if (window.M && text) {
                window.M.toast({ html: text });
            }
        },
        [],
    )
}