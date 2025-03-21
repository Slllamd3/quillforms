/**
 * QuillForms Dependencies
 */
import { getNewPath, getHistory } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { DropdownMenu, MenuItem, MenuGroup } from '@wordpress/components';
import { moreHorizontal } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { omit } from 'lodash';

const FormActions = ( { form, formId, setIsDeleting } ) => {
	const { deleteEntityRecord, saveEntityRecord } = useDispatch( 'core' );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);
	return (
		<div
			role="presentation"
			className="quillforms-home-form-actions"
			onClick={ ( e ) => e.stopPropagation() }
		>
			<DropdownMenu
				icon={ moreHorizontal }
				popoverProps={ {
					position: 'bottom left',
				} }
				className="quillforms-home-form-actions__dropdown"
			>
				{ ( { onClose } ) => (
					<MenuGroup className="quillforms-home-form-actions__menu-group">
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${ formId }/builder`
									)
								);
							} }
						>
							Edit
						</MenuItem>
						{ /* <MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								onClose();
								saveEntityRecord( 'postType', 'quill_forms', {
									...omit( form, [ 'id', 'integrations' ] ),
									title: form.title.rendered + '-copy',
									status: 'draft',
									theme: form.theme.id,
								} );
							} }
						>
							Duplicate
						</MenuItem> */ }
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${ formId }/results`
									)
								);
							} }
						>
							Results
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${ formId }/integrations`
									)
								);
							} }
						>
							Integrations
						</MenuItem>

						<MenuItem
							className="quillforms-home-form-actions__menu-item quillforms-home-form-actions__delete-form"
							onClick={ async () => {
								setIsDeleting( true );
								const res = await deleteEntityRecord(
									'postType',
									'quill_forms',
									formId
								);
								if ( ! res ) {
									createErrorNotice(
										'⛔ Errror in form deletion!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
									setIsDeleting( false );
								} else {
									createSuccessNotice(
										'✅ Form moved to trash successfully!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								}
								onClose();
							} }
						>
							Move to trash
						</MenuItem>
					</MenuGroup>
				) }
			</DropdownMenu>
		</div>
	);
};

export default FormActions;
