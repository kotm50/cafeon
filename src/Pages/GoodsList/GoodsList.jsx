import queryString from "query-string";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { Helmet } from "react-helmet";
//import { goodsList } from "../../Data/Dummy";
import { kyApi, getPrice } from "../../Api/Api";
import Pagenation from "../../Components/Pagenation";

import ImgLoad from "../../Components/ImgLoad";
import Sorry from "../../Components/Sorry";

function GoodsList() {
  const [goods, setGoods] = useState([]);
  const thisLocation = useLocation();
  const { category, brand } = useParams();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const keyword = parsed.keyword || "";
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(1);

  const [catName, setCatName] = useState("");
  const [resultNum, setResultNum] = useState("");
  const [errMsg, setErrMsg] = useState("조회 된 내용이 없습니다");

  useEffect(() => {
    setGoods([]);
    // location이 바뀔 때마다 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    setLoadMsg("상품을 불러오고 있습니다");
    getGoods(category, brand, page, size, keyword);

    setCatName(
      Number(category) === 1
        ? "커피/음료"
        : Number(category) === 2
        ? "베이커리/도넛"
        : Number(category) === 3
        ? "아이스크림"
        : Number(category) === 4
        ? "편의점"
        : Number(category) === 5
        ? "피자/버거/치킨"
        : Number(category) === 6
        ? "외식/분식/배달"
        : Number(category) === 7
        ? "영화/음악/도서"
        : Number(category) === 9
        ? "뷰티/헤어/바디"
        : Number(category) === 10
        ? "출산/생활/통신"
        : category === "etc"
        ? "기타상품"
        : "전체 상품"
    );
    //eslint-disable-next-line
  }, [thisLocation]);
  /*
  const getGoods = async () => {
    setLoading(true);
    setGoods(goodsList);
    setLoading(false);
  };
  */

  const getGoods = async (c, b, p, s, k) => {
    setLoading(true);
    let listUrl = "/biz/v1/shop/goods/list";
    if (c !== undefined && b === undefined) {
      listUrl = "/biz/v1/shop/goods/list";
      listUrl = listUrl + "/" + c;
    }
    if (b !== undefined) {
      listUrl = "/biz/v1/shop/goods/list/brand";
      listUrl = listUrl + "/" + b;
    }
    if (c === "etc") {
      listUrl = "/biz/v1/shop/goods/etc/list";
    }
    if (k !== "") {
      listUrl = `/biz/v1/shop/goods/search/${k}`;
    }
    const data = {
      page: p,
      size: s,
    };
    try {
      const res = await kyApi.get(listUrl, { searchParams: data }).json();

      setGoods(res.goodsList);
      setResultNum(res.listNum);
      setLast(res.totalPages);
    } catch (error) {
      console.log(error);
      setErrMsg("알 수 없는 오류 발생");
    }
    setLoading(false);
  };

  function checkName(name) {
    //name의 마지막 음절의 유니코드(UTF-16)
    const charCode = name.charCodeAt(name.length - 1);

    //유니코드의 한글 범위 내에서 해당 코드의 받침 확인
    const consonantCode = (charCode - 44032) % 28;

    if (consonantCode === 0) {
      //0이면 받침 없음 -> 를
      return `로`;
    }
    //1이상이면 받침 있음 -> 을
    return `으로`;
  }

  return (
    <>
      <Helmet>
        <title>
          {keyword ? `${keyword} 검색결과 | ` : catName ? `${catName} | ` : ""}
          카페콘닷컴
        </title>
      </Helmet>
      {goods && goods.length > 0 ? (
        <>
          {keyword && (
            <h3 className="text-lg lg:text-2xl p-2 bg-orange-50 rounded-lg mt-2 text-center lg:text-left">
              <span className="font-neobold text-sky-500">{keyword}</span>
              {checkName(keyword)} 검색하여 <br className="block lg:hidden" />총{" "}
              <span className="font-neobold text-red-500">{resultNum}</span>
              개의 상품을 발견했습니다
            </h3>
          )}
          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
            {goods.map((good, idx) => (
              <Link
                key={idx}
                to={`/goods/detail/${good.goodsCode}`}
                className="pb-0 min-h-0 h-fit"
              >
                <div className="group p-2 rounded">
                  <div className="w-32 h-32 lg:w-48 lg:h-48 mx-auto rounded overflow-hidden max-w-full bg-white hover:drop-shadow-xl border">
                    <ImgLoad good={good} type="goods" />
                  </div>
                  <div className="w-32 lg:w-48 mx-auto grid grid-cols-1 pt-1 border-gray-100 max-w-full mt-3">
                    <p className="lg:text-base group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-neobold text-blue-500">
                      {good.brandName}
                    </p>
                    <p
                      className="lg:text-lg group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left"
                      title={good.goodsName}
                    >
                      {good.goodsName}
                    </p>
                    <p className="lg:text-lg text-left mt-3">
                      <span className="text-xl text-rose-500">
                        {getPrice(Number(good.discountPrice)).toLocaleString()}
                      </span>{" "}
                      P
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>{!loading && <Sorry message={errMsg} />}</>
      )}
      {goods && goods.length > 0 ? (
        <div className="my-10">
          <Pagenation last={last} />
        </div>
      ) : null}

      {loading && (
        <div className="bg-white bg-opacity-55 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-hidden z-[9999999999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[50px] text-center flex flex-col justify-center z-[10000000000]">
            <div className="loader" />
            <span className="absolute w-[50vw] bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
              {loadMsg}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default GoodsList;
