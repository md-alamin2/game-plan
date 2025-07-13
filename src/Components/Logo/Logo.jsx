import React from 'react';
import logo from '../../assets/GamePlane_logo.png'

const Logo = () => {
    return (
        <div className='flex items-center gap-2'>
            <img className='w-14' src={logo} alt="logo" />
            <h3 className='text-2xl font-semibold'>GamePlane</h3>
        </div>
    );
};

export default Logo;