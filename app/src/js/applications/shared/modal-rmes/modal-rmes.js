import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import D from 'js/i18n';

function ModalRmes({
	id,
	isOpen,
	title,
	body,
	footer,
	closeCancel,
	modalButtons,
}) {
	const buttons = modalButtons.map((b, i) => (
		<button
			key={`${id}-${i}`}
			type="button"
			className={`btn btn-${b.style} btn-lg`}
			onClick={b.action}
			disabled={b.disabled}
		>
			{b.label}
		</button>
	));
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={isOpen}
			onRequestClose={closeCancel}
			contentLabel={body}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={closeCancel}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{D.btnClose}</span>
					</button>
					<h4 className="modal-title">{title}</h4>
				</div>
				{body && (
					<div className="modal-body">
						<div
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(body),
							}}
						/>
					</div>
				)}
				<div className="modal-footer">
					<div className="text-center">{buttons}</div>
					{footer && (
						<div
							style={{ textAlign: 'left', marginTop: '20px' }}
							className="red"
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(footer),
							}}
						/>
					)}
				</div>
			</div>
		</Modal>
	);
}

ModalRmes.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	body: PropTypes.string,
	footer: PropTypes.string,
	closeCancel: PropTypes.func.isRequired,
	modalButtons: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			action: PropTypes.func.isRequired,
			style: PropTypes.string.isRequired,
			disabled: PropTypes.bool,
		})
	).isRequired,
};

export default ModalRmes;
