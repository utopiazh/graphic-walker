import React, { useRef, useCallback } from "react";
import { FileReader } from "@kanaries/web-data-loader";
import { IRow } from "../../interfaces";
import Table from "../table";
import styled from "styled-components";
import { useGlobalStore } from "../../store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

const Container = styled.div`
    overflow-x: auto;
`;

interface ICSVData {}
const CSVData: React.FC<ICSVData> = (props) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const { commonStore } = useGlobalStore();
    const { tmpDSName, tmpDataSource } = commonStore;

    const onSubmitData = useCallback(() => {
        commonStore.commitTempDS();
    }, []);

    const { t } = useTranslation("translation", { keyPrefix: "DataSource.dialog.file" });

    return (
        <Container>
            <input
                style={{ display: "none" }}
                type="file"
                ref={fileRef}
                onChange={(e) => {
                    const files = e.target.files;
                    if (files !== null) {
                        const file = files[0];
                        FileReader.csvReader({
                            file,
                            config: { type: "reservoirSampling", size: Infinity },
                            onLoading: () => {},
                        }).then((data) => {
                            commonStore.updateTempDS(data as IRow[]);
                        });
                    }
                }}
            />
            <div className="mt-1 mb-1">
                <button
                    className="inline-block min-w-96 text-xs mr-2 pt-1 pb-1 pl-6 pr-6 border border-gray-500 rounded-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                        if (fileRef.current) {
                            fileRef.current.click();
                        }
                    }}
                >
                    {t("open")}
                </button>
                <button
                    className="inline-block min-w-96 text-xs mr-2 pt-1 pb-1 pl-6 pr-6 bg-black rounded-sm hover:bg-gray-500 text-white font-bold disabled:bg-gray-300"
                    disabled={tmpDataSource.length === 0}
                    onClick={() => {
                        onSubmitData();
                    }}
                >
                    {t("submit")}
                </button>
            </div>
            <div className="my-2">
                <label className="block text-xs text-gray-800 mb-1 font-bold">{t("dataset_name")}</label>
                <input
                    type="text"
                    placeholder={t("dataset_name")}
                    value={tmpDSName}
                    onChange={(e) => {
                        commonStore.updateTempName(e.target.value);
                    }}
                    className="text-xs p-2 rounded border border-gray-200 outline-none focus:outline-none focus:border-blue-500 placeholder:italic placeholder:text-slate-400"
                />
            </div>
            <Table />
        </Container>
    );
};

export default observer(CSVData);
