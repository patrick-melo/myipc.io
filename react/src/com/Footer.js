import T from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import config from '../config.js';

export default function IPCFooter(props)
{
  const now = new Date();
  const year = now.getFullYear();
  const style = {
    footer: {
      display: 'flex',
      flexDirection: 'right',
      padding: '24px',
      backgroundColor: 'primary.main'
    },

    version: {
      flex: 1,
      fontFamily: 'poppins-semibold',
      color: 'secondary.main'
    },

    copyright: {
      fontFamily: 'poppins-semibold',
      color: 'secondary.main',
    }
  }; 

  return (
    <Box sx={ style.footer }>
      <T sx={ style.version }>{ config.VERSION }</T>
      <T component={ Link } href="https://www.playchemy.com" sx={ style.copyright }>
        © 2022-{year} Playchemy
      </T>
    </Box>
  );
}
