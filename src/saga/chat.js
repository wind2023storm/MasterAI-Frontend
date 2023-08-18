import { call, put, takeLatest } from "redux-saga/effects";
import { callAPI } from ".";
import { actions } from "../actions";
import { fetchMessage, fetchMessageFailed, fetchMessageSuccess } from "../store/chat";
const API_HOST = process.env.REACT_APP_BASE_URL;

export function* fetchMessageSaga(action) {
  try {
    yield put(fetchMessage(action.payload));
    let result = yield call(() =>
      callAPI({ url: `${API_HOST}/getReply`, method: "POST", data: { message: action.payload } })
    );
    yield put(fetchMessageSuccess(result.data ? result.data : ""));
  } catch (err) {
    yield put(fetchMessageFailed(err.response?.data?.error?.message ?? "Failed to fetch message."));
  }
}

export function* fetchMessageWatcher() {
  yield takeLatest(actions.chat.FETCH_MESSAGE, fetchMessageSaga);
}
