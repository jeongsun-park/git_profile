import { useEffect, useReducer } from "react";
import { SUCCESS, ERROR, LOADING } from "../const";

export default function List() {
  const initState = {
    //api를 호출했을때 로딩 유무
    loading: false,
    //api를 호출했을때 에러 확인
    error: null,
    //api를 호출했을때 데이터 넣기
    data: null,
  };
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    async function getUser() {
      dispatch({ type: LOADING });
      try {
        const token = import.meta.env.VITE_WEATHER_API_KEY;
        const response = await fetch(
          "https://api.github.com/users/jeongsun-park/repos?sort=created",
          {
            headers: {
              Authorization: `token ${token}`,
              "user-Agent": "github-profile",
            },
          }
        );
        const data = await response.json();
        dispatch({ type: SUCCESS, data: data });
      } catch (e) {
        dispatch({ type: ERROR, error: e.message });
      }
    }
    getUser();
  }, []);

  //3가지 액션 생성
  // LOADING : 데이터를 가져오는 중
  // SUCCESS : 데이터를 가져오는데 성공
  // ERROR : 데이터를 가져오는데 실패

  function reducer(state, action) {
    switch (action.type) {
      case SUCCESS:
        return { ...state, loading: false, data: action.data };
      case LOADING:
        return { ...state, loading: true };
      case ERROR:
        return { ...state, error: action.error, loading: false };
      default:
        throw new Error("에러");
    }
  }
  return (
    <div className="list_conteiner">
      {/* 현재상태가 로딩중일때 */}
      {state.loading && <p>로딩중...</p>}
      {/* 에러가 존재할때 */}
      {state.error && <p>{state.error}</p>}
      {/* 로딩중이 아니고 에러도 존재하지않고 데이터가 존재할때 */}
      {!state.loading && !state.error && state.data && (
        <>
          {state.data.map((list) => (
            <div key={list.id} className="list">
              <a href={list.html_url} target="_blank">
                <p>{list.name}</p>
              </a>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
