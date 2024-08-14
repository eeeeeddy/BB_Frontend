import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const postChkAtom = atom({
    key: "postChkAtom",
    default: false,
    effects_UNSTABLE: [persistAtom]
});