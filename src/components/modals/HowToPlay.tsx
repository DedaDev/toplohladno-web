import Modal from "../Modal.tsx";
import { FC } from "react";

interface IHowToPlay {
    isOpenHowToPlayModal: boolean,
    setIsOpenHowToPlayModal: (v: boolean) => void
}
export const HowToPlayModal: FC<IHowToPlay> = ({ isOpenHowToPlayModal, setIsOpenHowToPlayModal }) => {
  return <Modal isOpen={isOpenHowToPlayModal} onClose={() => setIsOpenHowToPlayModal(false)}>
    <h1 className="text-xl mb-4">Kako se igra?</h1>
    <p className="text-sm">
            Vaš zadatak je da pronađete skrivenu reč, imate neograničen broj pokušaja!
      <br />
      <br />
            Uz svaki pokušaj dobićete povratnu informaciju koliko je vaša reč &quot;blizu&quot; zadate reči.
            Broj pored reči označava koliko ima bližih reči od te reči.
      <br />
      <br />
            Blizinu određuje kompleksan AI algoritam.
      <br />
      <br />
            Srećno!
    </p>
  </Modal>
}

