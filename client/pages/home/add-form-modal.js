/**
 * QuillForms Dependencies.
 */
import { Button, TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies.
 */
import { css } from 'emotion';
import { getHistory, getNewPath } from '@quillforms/navigation';
import Loader from 'react-loader-spinner';
import classnames from 'classnames';

const AddFormModal = ( { closeModal } ) => {
	const [ title, setTitle ] = useState( '' );
	const [ isCreating, setIsCreating ] = useState( false );

	const createNewForm = () => {
		setIsCreating( true );
		// Post
		apiFetch( {
			path: '/wp/v2/quill_forms',
			method: 'POST',
			data: {
				title,
			},
		} ).then( ( res ) => {
			const { id } = res;
			getHistory().push( getNewPath( {}, `/forms/${ id }/builder` ) );
		} );
	};
	return (
		<Modal
			className={ classnames(
				'quillforms-home__add-form-modal',
				css`
					border: none !important;
					border-radius: 9px;

					.components-modal__header {
						background: linear-gradient( 42deg, #9236eb, #b916ee );
						h1 {
							color: #fff;
						}
						svg {
							fill: #fff;
						}
					}
				`
			) }
			title="Create new form"
			onRequestClose={ closeModal }
		>
			<div
				className={ css`
					margin-bottom: 20px;
				` }
			>
				Form Title
				<TextControl
					value={ title }
					onChange={ ( val ) => setTitle( val ) }
				/>
			</div>
			<div className="quillforms-home__add-form-modal-footer">
				<Button
					isDefault
					className={ css`
						margin-right: 10px !important;
					` }
					onClick={ closeModal }
				>
					Cancel
				</Button>
				<Button
					className={ css`
						width: 70px;
						display: flex;
						justify-content: center;
						align-items: center;
					` }
					onClick={ () => {
						if ( ! isCreating ) {
							createNewForm();
						}
					} }
					isPrimary
				>
					{ isCreating ? (
						<Loader
							className={ css`
								display: flex;
								justify-content: center;
								align-items: center;
							` }
							type="Oval"
							color="#00BFFF"
							height={ 15 }
							width={ 15 }
						/>
					) : (
						'Create'
					) }
				</Button>
			</div>
		</Modal>
	);
};

export default AddFormModal;
