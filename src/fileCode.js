import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function FileCodePage() {
    const { code } = useParams();
    const navigate = useNavigate();
   
    return (
        <div className="dashboard-container admin">
            <div className="dashboard-box">
                <h2>Payment Successful</h2>
                <p>Here is your verification code:</p>
                <div className="verification-code" style={{ 
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    margin: '20px 0',
                    padding: '15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '5px'
                }}>
                    {code}
                </div>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Go to Dashboard to Download File
                </button>
            </div>
        </div>
    )
}