import ky from "ky";
import { useDispatch } from "react-redux";
import { clearUser } from "../Reducer/userSlice";
import { useNavigate } from "react-router-dom";

// ky API 인스턴스 생성
export const kyApi = ky.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 타임아웃 설정 (10초)
});

export const uploadFile = async (file, folder) => {
  const MAX_FILE_SIZE_MB = 10; // 최대 파일 크기 제한 (10MB)
  const formData = new FormData();

  if (!file) {
    alert("업로드할 파일이 없습니다.");
    return;
  }

  // 파일 크기 체크
  const fileSizeInMB = file.size / (1024 * 1024);
  console.log(fileSizeInMB);
  if (fileSizeInMB > MAX_FILE_SIZE_MB) {
    alert(
      `파일 크기가 너무 큽니다. (${fileSizeInMB.toFixed(
        2
      )} MB). 최대 ${MAX_FILE_SIZE_MB}MB까지 업로드할 수 있습니다.`
    );
    return;
  }

  // 폼 데이터에 파일 추가
  formData.append("file", file);

  try {
    const res = await ky
      .post(`/api/v1/common/upload/${folder}`, {
        body: formData, // FormData 객체를 body로 전달
      })
      .json();

    console.log("File uploaded successfully:", res);
    return res.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

export const deleteFile = async url => {
  const data = {
    url: url,
  };
  try {
    const res = await ky
      .delete(`/api/v1/common/delete/file`, {
        json: data, // FormData 객체를 body로 전달
      })
      .json();

    console.log("File deleted successfully:", res);
    return res.code;
  } catch (error) {
    console.error("File delete failed:", error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 인스턴스 내보내기
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await kyApi.post("/api/v1/cafecon/user/logout").json();
      if (res.code === "C000" || res.code === "E403") {
        navigate("/"); // 로그아웃 후 홈 화면으로 리디렉션
        dispatch(clearUser()); // Redux 상태 초기화
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return handleLogout;
};

export const escapeHTML = text => {
  return text
    .replace(/</g, "＜")
    .replace(/>/g, "＞")
    .replace(/=/g, "＝")
    .replace(/\(/g, "（")
    .replace(/\)/g, "）")
    .replace(/,/g, "，")
    .replace(/"/g, "＂")
    .replace(/:/g, "：")
    .replace(/;/g, "；")
    .replace(/\//g, "／");
};

export const unescapeHTML = text => {
  let filtertxt = text
    .replace(/＜/g, "<")
    .replace(/＞/g, ">")
    .replace(/＝/g, "=")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/，/g, ",")
    .replace(/＂/g, '"')
    .replace(/：/g, ":")
    .replace(/；/g, ";")
    .replace(/／/g, "/");

  return filtertxt
    .replace(/<center>/g, '<p class="ql-align-center">') // <center> 태그 변경
    .replace(/<\/center>/g, "</p>") // </center> 태그 변경;
    .replace(
      /<center\s*style=["']text-align:\s*center;["']>/g,
      '<p class="ql-align-center">'
    ); // <center style="text-align:center;"> 태그 변경
};

export const getPrice = price => {
  return Math.ceil(price / 100) * 100;
};
