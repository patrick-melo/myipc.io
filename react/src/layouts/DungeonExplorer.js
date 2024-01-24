import { useParams } from "react-router-dom";

import Game from '../phaser/game';


export default function DungeonExplorer(props) {

  const { value } = useParams();

  // if (typeof value == 'string' && value.match(/^0x/))
  //   return (<Wallet walletAddress={value} />);
  // else 
  //   return (<IPCExplorer tokenId={value} />);
  return (<Game dungeonAddrs={value}/>);

}

