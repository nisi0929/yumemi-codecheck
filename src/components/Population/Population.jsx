import axios from "axios";
import { useEffect } from "react";
import { Charts } from "./Charts";
export const Population = ({ checkList, population, setPopulation }) => {
  // 人口の取得
  useEffect(() => {
    const API_KEY = process.env.REACT_APP_RESAS_API;
    // checkListのprefCodeを回して取得、取得したデータをpopulationに入れる
    checkList.map((c) => {
      console.log(c);
      console.log(population);
      axios
        .get(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${c.prefCode}`,
          {
            headers: { "X-API-KEY": API_KEY },
          }
        )
        .then((res) => {
          // 人口を配列にしたもの
          const populations = res.data.result.data[0].data.map((r) => {
            return r.value;
          });
          // 年を配列にしたもの
          const years = res.data.result.data[0].data.map((r) => {
            return r.year;
          });
          // 重複があれば重複を削除
          setPopulation(
            [
              ...population,
              {
                prefCode: c.prefCode,
                name: c.prefName,
                data: populations,
                years: years,
              },
            ].filter(
              (element, index, self) =>
                self.findIndex((e) => e.prefCode === element.prefCode) === index
            )
          );
        })
        .catch((error) => {
          // 通信エラーが発生したら
          console.log("通信失敗"); // ログに失敗と表示
          console.log(error.status); // エラーコードを表示
        });
    });
  }, [checkList]);

  return (
    <div>
      <Charts population={population} />
    </div>
  );
};
