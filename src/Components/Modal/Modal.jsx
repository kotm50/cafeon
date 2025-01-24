import PropTypes from "prop-types";
import warning from "../../assets/warning.svg";
import Gifticon from "../Gifticon";
import EditPwd from "../EditPwd/EditPwd";
import Specification from "../Specification/Specification";

function Modal(props) {
  return (
    <>
      {props.modalOn ? (
        <>
          <div className="fixed top-1/2 left-1/2 min-w-[600px] min-h-[100px] -translate-x-1/2 -translate-y-1/2 p-2 z-[2000] bg-white rounded-lg">
            {props.modalType === "buy" ? (
              <Gifticon
                setModalOn={props.setModalOn}
                setModalType={props.setModalType}
                buyIt={props.buyIt}
                user={props.login}
                goodsPrice={props.goodsPrice}
              />
            ) : props.modalType === "join" ? (
              <>
                <img src={warning} alt="" className="w-[200px] h-auto" />
                <p className="text-center text-xl font-bold">준비중 입니다</p>
              </>
            ) : props.modalType === "password" ? (
              <EditPwd
                setModalOn={props.setModalOn}
                setModalType={props.setModalType}
                user={props.login}
                setUserPwd={props.setUserPwd}
              />
            ) : props.modalType === "purchaseSpecification" ? (
              <Specification
                setModalOn={props.setModalOn}
                setModalType={props.setModalType}
                type="withdraw"
                pointInfo={props.pointInfo}
              />
            ) : props.modalType === "depositSpecification" ? (
              <Specification
                setModalOn={props.setModalOn}
                setModalType={props.setModalType}
                type="deposit"
                pointInfo={props.pointInfo}
              />
            ) : null}
          </div>
          <div
            className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-y-hidden bg-black bg-opacity-50 z-[1000]"
            onClick={() => {
              props.setModalType("");
              props.setModalOn(false);
            }}
          ></div>
        </>
      ) : null}
    </>
  );
}

Modal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  modalType: PropTypes.string.isRequired,
  buyIt: PropTypes.func,
  login: PropTypes.object,
  goodsPrice: PropTypes.number,
  extendLogin: PropTypes.func,
  getLimitandPoint: PropTypes.func,
  setUserPwd: PropTypes.func,
  pointInfo: PropTypes.object,
};

export default Modal;
